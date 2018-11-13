var express = require('express');
var router = express.Router();
var aws = require('aws-sdk');
var _ = require('lodash');

var {Product} = require('./models/product');
var {FTLocation} = require('./models/ftlocation');
var Cart = require('./models/cart');
var {User} = require('./models/user');
var {makeChunk} = require('./modules/makeChunk');
var {makeChunkForSize} = require('./modules/makeChunkForSize');
var {emailContactUs} = require('./middleware/emailContactUs');

/* GET Home page. */
router.get('/', function(req, res, next) {
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    var size = 3;
    makeChunkForSize(size).then(function(data) {
        FTLocation.find(function(err1, locs) {
            if (err1) {
                return res.redirect('/');
            }
            req.session.cart = cart;
            res.render('index', { title: 'UpTaste', sushis: data[0], noodles: data[1], drinks: data[2], cartItems: cart.generateArray(), totalPrice: cart.totalPrice.toFixed(2), totalQty: cart.totalQty, pickupLoc: cart.pickupLoc, Qtys: cart.totalQty > 1, ftlocations: locs, isLoggedIn: req.isAuthenticated(), carouseDisabled: null, currentUrl: null });
        });
    }).catch(function(err) {
        console.log(err);
    });
});

/* GET Remove One From Cart page. */
router.get('/remove-one-fromcart/:id', function(req, res, next) {
    var productId = req.params.id;
    var matchedProduct = {};
    var size = 3;
    makeChunkForSize(size).then(function(data) {
        FTLocation.find(function(err1, locs) {
            if (err1) {
                return res.redirect('/');
            }
            
            var cart = new Cart(req.session.cart ? req.session.cart : {});
            
            // Remove one item from cart
            if (!cart.items[productId]) {
                if (!cart.items) {
                    return res.render('shops/menus', {title: 'UpTaste', cartItems: null, cartOpen: 'yes', sushis: data[0], noodles: data[1], drinks: data[2], ftlocations: locs, currentUrl: null });
                } else {
                    return res.render('index', {title: 'UpTaste', sushis: data[0], noodles: data[1], drinks: data[2], cartItems: cart.generateArray(), totalPrice: cart.totalPrice.toFixed(2), totalQty: cart.totalQty, Qtys: cart.totalQty > 1, ftlocations: locs, cartOpen: 'yes', currentUrl: null });
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

            res.render('index', {title: 'UpTaste', sushis: data[0], noodles: data[1], drinks: data[2], cartItems: cart.generateArray(), totalPrice: cart.totalPrice.toFixed(2), totalQty: cart.totalQty, Qtys: cart.totalQty > 1, ftlocations: locs, cartOpen: 'yes', currentUrl: null });
        });
    }).catch(function(err) {
        console.log(err);
    });
});

/* GET Clear Cart page. */
router.get('/clear-cart', function(req, res, next) {
    var size = 3;
    makeChunkForSize(size).then(function(data) {
        FTLocation.find(function(err1, locs) {
            if (err1) {
                return res.redirect('/');
            }
            var cart = new Cart(req.session.cart ? req.session.cart : {});
            // Remove Cart
            if (!cart.items) {
                return res.render('shops/menus', {title: 'UpTaste', cartItems: null, className: 'show', sushis: data[0], noodles: data[1], drinks: data[2], ftlocations: locs, currentUrl: null });
            }
            cart.items = {};
            cart.totalPrice = 0.00;
            cart.totalQty = 0;
            req.session.cart = cart;

            res.render('index', {title: 'UpTaste', cartItems: cart.generateArray(), totalPrice: cart.totalPrice.toFixed(2), totalQty: cart.totalQty, Qtys: cart.totalQty > 1, sushis: data[0], noodles: data[1], drinks: data[2], ftlocations: locs, currentUrl: null });
        });
    }).catch(function(err) {
        console.log(err);
    });
});

/* POST Contact page. */
router.post('/contact', emailContactUs, function(req, res, next) {
    res.send();    
});


module.exports = router;
