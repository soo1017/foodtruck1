var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var {Product} = require('./models/product');
var {makeChunkForSize} = require('./modules/makeChunkForSize');
var {makeChunk} = require('./modules/makeChunk');
var Cart = require('./models/cart');
var {Order} = require('./models/order');

var app = express();

var csrfProtection = csrf();
router.use(csrfProtection); 

app.use(function (req, res, next) {
  var token = req.csrfToken();
  res.cookie('XSRF-TOKEN', token);
  res.locals.csrfToken = token;
  next();
});

/* GET shop Home page. */
router.get('/', function(req, res, next) {
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    var size = 3;
    makeChunkForSize(size).then(function(data) {
        res.render('shops/menus', { title: 'UpTaste', sushis: data[0], noodles: data[1], drinks: data[2], cartItems: cart.generateArray(), totalPrice: cart.totalPrice.toFixed(2), totalQty: cart.totalQty, Qtys: cart.totalQty > 1, isLoggedIn: req.isAuthenticated(), carouseDisabled: "yes", currentUrl: "/shop" });
    }).catch(function(err) {
        console.log(err);
    });
});
           
/* GET shop page. */
router.get('/add-to-cart/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    
    Product.findById(productId, function(err, product) {
        if (err) {
            return res.redirect('/shop/');
        }
        cart.add(product, product._id);
        req.session.cart = cart;
        res.redirect('/shop/');
    });
});

/* GET Remove One From Cart page. */
router.get('/remove-one-fromcart/:id', function(req, res, next) {
    var productId = req.params.id;
    var matchedProduct = {};
    var size = 3;
    makeChunkForSize(size).then(function(data) {
        var cart = new Cart(req.session.cart ? req.session.cart : {});
        
        
        // Remove one item from cart
        if (!cart.items[productId]) {
            if (!cart.items) {
                return res.render('shops/menus', {title: 'UpTaste', cartItems: null, cartOpen: 'yes', sushis: data[0], noodles: data[1], drinks: data[2], carouseDisabled: "yes", currentUrl: "/shop"});
            } else {
                return res.render('shops/menus', {title: 'UpTaste', cartItems: cart.generateArray(), totalPrice: cart.totalPrice.toFixed(2), totalQty: cart.totalQty, Qtys: cart.totalQty > 1, cartOpen: 'yes', sushis: data[0], noodles: data[1], drinks: data[2], carouseDisabled: "yes", currentUrl: "/shop"});
            }
        }
        matchedProduct = cart.items[productId].item;
        cart.items[productId].qty--;
        cart.items[productId].price -= matchedProduct.price;
        if (cart.items[productId].qty == 0) {
            delete cart.items[productId];
        }
        cart.totalQty--;
        cart.totalPrice -= matchedProduct.price;
        req.session.cart = cart;

        res.render('shops/menus', {title: 'UpTaste', cartItems: cart.generateArray(), totalPrice: cart.totalPrice.toFixed(2), totalQty: cart.totalQty, Qtys: cart.totalQty > 1, cartOpen: 'yes', sushis: data[0], noodles: data[1], drinks: data[2], carouseDisabled: "yes", currentUrl: "/shop" });
        
    }).catch(function(err) {
        console.log(err);
    });
});

/* GET Clear Cart page. */
router.get('/clear-cart', function(req, res, next) {
    var size = 3;
    makeChunkForSize(size).then(function(data) {
       
        var cart = new Cart(req.session.cart);
        // Remove Cart
        if (!cart.items) {
            return res.render('shops/menus', {title: 'UpTaste', cartItems: null, className: 'show', sushis: data[0], noodles: data[1], drinks: data[2]});
        }
        cart.items = {};
        cart.totalPrice = 0.00;
        cart.totalQty = 0;
        req.session.cart = cart;
        
        res.render('shops/menus', {title: 'UpTaste', cartItems: cart.generateArray(), totalPrice: cart.totalPrice.toFixed(2), totalQty: cart.totalQty, Qtys: cart.totalQty > 1, sushis: data[0], noodles: data[1], drinks: data[2], pickupLoc: cart.pickupLoc, isLoggedIn: req.isAuthenticated(), carouseDisabled: "yes", currentUrl: "/shop" });
    }).catch(function(err) {
        console.log(err);
    });
});


/* GET Checkout page. */
router.get('/checkout', isLoggedIn, function(req, res, next) {
    var userId = req.session.passport.user;
    if (!req.session.cart) {
        return res.redirect('/shop');
    }
    Order.findOne({user: userId}, function(err, order) {
        if (err) {
            return res.redirect('/shop');
        }
        if (!order) {
            var cart = new Cart(req.session.cart);
            var errMsg = req.flash('error')[0];
            req.session.cart = cart;
            return res.render('shops/checkout', {title: 'UpTaste', csrfToken: req.csrfToken(), cartItems: cart.generateArray(), totalPrice: cart.totalPrice.toFixed(2), totalQty: cart.totalQty, Qtys: cart.totalQty > 1, pickupLoc: cart.pickupLoc, errMsg: errMsg, noErrors: !errMsg, isLoggedIn: req.isAuthenticated(), carouseDisabled: "yes" });
        }
        var preorder = {};
            preorder.name = order.name;
            preorder.phone = order.phone;
            preorder.email = order.userEmail;
            preorder.address = order.address;
        var cart = new Cart(req.session.cart);
        var errMsg = req.flash('error')[0];
        req.session.cart = cart;
        res.render('shops/checkout', {title: 'UpTaste', csrfToken: req.csrfToken(), cartItems: cart.generateArray(), totalPrice: cart.totalPrice.toFixed(2), totalQty: cart.totalQty, Qtys: cart.totalQty > 1, pickupLoc: cart.pickupLoc, errMsg: errMsg, noErrors: !errMsg, isLoggedIn: req.isAuthenticated(), carouseDisabled: "yes", preorder: preorder });
    });
});

/* GET Checkout page with a Quest. */
router.get('/checkout-guest', function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shop');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    req.session.cart = cart;
    res.render('shops/checkout', {title: 'UpTaste', csrfToken: req.csrfToken(), cartItems: cart.generateArray(), totalPrice: cart.totalPrice.toFixed(2), totalQty: cart.totalQty, Qtys: cart.totalQty > 1, pickupLoc: cart.pickupLoc, errMsg: errMsg, noErrors: !errMsg, isLoggedIn: req.isAuthenticated(), carouseDisabled: "yes" });
});

/* GET Clear Cart page. */
router.get('/checkout/clear-cart', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shop/checkout');
    }
       
    var cart = new Cart(req.session.cart);
    // Remove Cart
    if (!cart) {
        return res.render('shops/checkout', {title: 'UpTaste', cartItems: null});
    }
    cart.items = {};
    cart.totalPrice = 0.00;
    cart.totalQty = 0;
    req.session.cart = cart;
        
    res.render('shops/checkout', {title: 'UpTaste', cartItems: cart.generateArray(), totalPrice: cart.totalPrice.toFixed(2), totalQty: cart.totalQty, pickupLoc: cart.pickupLoc, carouseDisabled: "yes" });
});

/* GET Clear Cart page. */
router.get('/checkout/clear-cart-guest', function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shop/checkout');
    }
       
    var cart = new Cart(req.session.cart);
    // Remove Cart
    if (!cart) {
        return res.render('shops/checkout', {title: 'UpTaste', cartItems: null});
    }
    cart.items = {};
    cart.totalPrice = 0.00;
    cart.totalQty = 0;
    req.session.cart = cart;
        
    res.render('shops/checkout', {title: 'UpTaste', cartItems: cart.generateArray(), totalPrice: cart.totalPrice.toFixed(2), totalQty: cart.totalQty, pickupLoc: cart.pickupLoc, carouseDisabled: "yes" });
});

/* POST Checkout. */ 
// without Stripe Payment
router.post('/checkout', isLoggedIn, function(req, res, next) {

    if (!req.session.cart) {
        return res.redirect('/shop/checkout');
    }
    var cart = new Cart(req.session.cart); 
    var order = new Order({
        user: req.user,                         // In case of login only
        cart: cart,
        address: req.body.address,
        name: req.body.name,
        userEmail: req.body.email,
        phone: req.body.phone,
        paymentId: "not available now",        // from Stripe
        createdAt: new Date().getTime()
    });
  
    order.save(function(err, result) {
        if (err) {
            return res.send(err);
        }
        req.flash('success', 'Successfully bought product');
//        req.session.cart = null;
        cart.items = {};
        cart.totalPrice = 0.00;
        cart.totalQty = 0;
        cart.pickupLoc = "Restaurant";
        req.session.cart = cart;
        res.redirect('/shop/thanks');
    });
});

/* POST Checkout with a guest. */ 
// without Stripe Payment
router.post('/checkout-guest', function(req, res, next) {
 
    if (!req.session.cart) {
        return res.redirect('/shop/checkout-guest');
    }
    var cart = new Cart(req.session.cart); 
    var order = new Order({
        //user: req.user,             // In case of login only
        cart: cart,
        address: req.body.address,
        name: req.body.name,
        userEmail: req.body.email,
        phone: req.body.phone,
        paymentId: "not available now",        // from Stripe
        createdAt: new Date().getTime()
    });
    order.save(function(err, result) {
        if (err) {
            return res.send(err);
        }
        req.flash('success', 'Successfully bought product');
//        req.session.cart = null;
        cart.items = {};
        cart.totalPrice = 0.00;
        cart.totalQty = 0;
        cart.pickupLoc = "Restaurant";
        req.session.cart = cart;
        res.redirect('/shop/thanks-guest');
    });
});

/* GET PickUo Loc Change page. */
router.get('/checkout/pickuploc', isLoggedIn, function(req, res, next) {
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    if (cart.pickupLoc == "Restaurant") {
        cart.pickupLoc = "Food Truck";
    } else {
        cart.pickupLoc = "Restaurant";
    }
    req.session.cart = cart;
    res.redirect('/shop/checkout');
});

/* GET PickUo Loc Change page. */
router.get('/checkout/pickuploc-guest', function(req, res, next) {
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    if (cart.pickupLoc == "Restaurant") {
        cart.pickupLoc = "Food Truck";
    } else {
        cart.pickupLoc = "Restaurant";
    }
    req.session.cart = cart;
    res.redirect('/shop/checkout-guest');
});

/* GET Remove One From Cart page. */
router.get('/checkout/remove-one-fromcart/:id', isLoggedIn, function(req, res, next) {
    var productId = req.params.id;
    var matchedProduct = {};
    
    var cart = new Cart(req.session.cart);
        
    // Remove one item from cart
    if (!cart.items[productId]) {
        if (!cart.items) {
            return res.render('shops/checkout', {title: 'UpTaste', cartItems: null, cartOpen: 'yes', carouseDisabled: "yes", pickupLoc: cart.pickupLoc});
        } else {
            return res.render('shops/checkout', {title: 'UpTaste', cartItems: cart.generateArray(), totalPrice: cart.totalPrice.toFixed(2), totalQty: cart.totalQty, pickupLoc: cart.pickupLoc, carouseDisabled: "yes", isLoggedIn: req.isAuthenticated() });
        }
    }
    matchedProduct = cart.items[productId].item;
    cart.items[productId].qty--;
    cart.items[productId].price -= matchedProduct.price;
    if (cart.items[productId].qty == 0) {
        delete cart.items[productId];
    }
    cart.totalQty--;
    cart.totalPrice -= matchedProduct.price;
    req.session.cart = cart;

    res.render('shops/checkout', {title: 'UpTaste', cartItems: cart.generateArray(), totalPrice: cart.totalPrice.toFixed(2), totalQty: cart.totalQty, pickupLoc: cart.pickupLoc, carouseDisabled: "yes", isLoggedIn: req.isAuthenticated() });
});

/* GET Remove One From Cart page. */
router.get('/checkout/remove-one-fromcart-guest/:id', function(req, res, next) {
    var productId = req.params.id;
    var matchedProduct = {};
    
    var cart = new Cart(req.session.cart);
        
   
    // Remove one item from cart
    if (!cart.items[productId]) {
        if (!cart.items) { 
            return res.render('shops/checkout', {title: 'UpTaste', cartItems: null, cartOpen: 'yes', carouseDisabled: "yes", pickupLoc: cart.pickupLoc});
        }
        else {
            return res.render('shops/checkout', {title: 'UpTaste', cartItems: cart.generateArray(), totalPrice: cart.totalPrice.toFixed(2), totalQty: cart.totalQty, pickupLoc: cart.pickupLoc, carouseDisabled: "yes", isLoggedIn: req.isAuthenticated() });
        } 
    }
    matchedProduct = cart.items[productId].item;
    cart.items[productId].qty--;
    cart.items[productId].price -= matchedProduct.price;
    if (cart.items[productId].qty == 0) {
        delete cart.items[productId];
    }
    cart.totalQty--;
    cart.totalPrice -= matchedProduct.price;
    req.session.cart = cart;

    res.render('shops/checkout', {title: 'UpTaste', cartItems: cart.generateArray(), totalPrice: cart.totalPrice.toFixed(2), totalQty: cart.totalQty, pickupLoc: cart.pickupLoc, carouseDisabled: "yes", isLoggedIn: req.isAuthenticated() });
});

/* GET Thanks page. */
router.get('/thanks', isLoggedIn, function(req, res, next) {
    res.render('shops/thanks', {title: 'UpTaste', carouseDisabled: "yes", footerDisabled: 'yes'});
});

/* GET Thanks page. */
router.get('/thanks-guest', function(req, res, next) {
    res.render('shops/thanks', {title: 'UpTaste', carouseDisabled: "yes", footerDisabled: 'yes'});
});

module.exports = router;

/// Middlewares
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    // after login, redirect into checkout page directly
    var baseurl = req.baseUrl;
    req.session.oldUrl = baseurl.concat('', req.url);
    res.redirect('/user/signin');
}

function printReq(req, res, next) {
    console.log("req: ", req);
    next();
}


/* POST Checkout. */ 
// with Stripe Payment
//router.post('/checkout', isLoggedIn, function(req, res, next) {
//    if (!req.session.cart) {
//        return res.redirect('/shop/checkout');
//    }
//    var cart = new Cart(req.session.cart); 
//    
//    var stripe = require("stripe")("sk_test_f9syjsCbMuNNKpUslErXqhQr");
//
//    stripe.charges.create({
//        amount: cart.totalPrice * 100,
//        currency: "usd",
//        source: req.body.stripeToken, // obtained with Stripe.js
//        description: "UpTaste Charge"
//    }, function(err, charge) {
//        if (err) {
//            req.flash('error', err.message);
//            return res.redirect('/shop/checkout')
//        }
//        // save Cart into DB
//        var order = new Order({
//            user: req.user,             // In case of login only
//            cart: cart,
//            address: req.body.address,
//            name: req.body.name,
//            paymentId: charge.id        // from Stripe
//        });
//        order.save(function(err, result) {
//            if (err) {
//                return res.send(err);
//            }
//            req.flash('success', 'Successfully bought product');
//            req.session.cart = null;
//            res.redirect('/shop/thanks');
//        })
//    });
//});


/* POST Checkout with a Guest */
// with Stripe Payment
//router.post('/checkout-guest', function(req, res, next) {
//    if (!req.session.cart) {
//        return res.redirect('/shop/checkout-guest');
//    }
//    var cart = new Cart(req.session.cart); 
//    
//    var stripe = require("stripe")("sk_test_f9syjsCbMuNNKpUslErXqhQr");
//
//    stripe.charges.create({
//        amount: cart.totalPrice * 100,
//        currency: "usd",
//        source: req.body.stripeToken, // obtained with Stripe.js
//        description: "UpTaste Charge"
//    }, function(err, charge) {
//        if (err) {
//            req.flash('error', err.message);
//            return res.redirect('/shop/checkout-guest')
//        }
//        // save Cart into DB
//        var order = new Order({
//            //user: req.user,             // In case of login only
//            cart: cart,
//            address: req.body.address,
//            name: req.body.name,
//            paymentId: charge.id        // from Stripe
//        });
//        order.save(function(err, result) {
//            if (err) {
//                return res.send(err);
//            }
//            req.flash('success', 'Successfully bought product');
//            req.session.cart = null;
//            res.redirect('/shop/thanks');
//        })
//    });
//});
