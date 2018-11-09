const {Product} = require('../routes/models/product');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/uptaste', { useNewUrlParser: true });

var products = [
    new Product({
        image: '/images/products/soba.jpg',
        name: 'Soba',
        description: 'japanese delicios cold noodle. very crispy when soaked with soy sauce. good to eat in hot summer',
        price: 10.99,
        category: 'noodle'
    }),
    new Product({
        image: '/images/products/chicken.jpg',
        name: 'Chicken',
        description: 'made with fresh chicken meat. everyone will love it due to its popularity',
        price: 11.99,
        category: 'noodle'
    }),
    new Product({
        image: '/images/products/japchae.jpg',
        name: 'Japchae',
        description: 'korean noodle made with a variety of seasoned vegetable mainly. for meat lover, better with grounded beef ',
        price: 12.99,
        category: 'noodle'
    }),
    new Product({
        image: '/images/products/pasta.jpg',
        name: 'Pasta',
        description: 'italian noodle. the world loves it. creamy with milk or fresh with seafood',
        price: 9.99,
        category: 'noodle'
    }),
    new Product({
        image: '/images/products/singapore.jpg',
        name: 'Singapore',
        description: 'not know it very much. it looks delicious',
        price: 7.99,
        category: 'noodle'
    }),
    new Product({
        image: '/images/products/udon.jpg',
        name: 'Udon',
        description: 'popular among many nations. various styles of udon in the world',
        price: 15.99,
        category: 'noodle'
    }),
    new Product({
        image: '/images/products/ramen.jpg',
        name: 'Ramen',
        description: 'very tasty. choose between many to please your taste',
        price: 3.99,
        category: 'noodle'
    }),
    new Product({
        image: '/images/products/cal.jpg',
        name: 'Cal',
        description: 'born in california, so it is very popular',
        price: 10.99,
        category: 'sushi'
    }),
    new Product({
        image: '/images/products/kumo.jpg',
        name: 'Kumo',
        description: 'movie title is same as this name because it is very provocative',
        price: 11.99,
        category: 'sushi'
    }),
    new Product({
        image: '/images/products/rainbow.jpg',
        name: 'Rainbow',
        description: 'rainbow with colorful and tasty',
        price: 12.99,
        category: 'sushi'
    }),
    new Product({
        image: '/images/products/tokyo.jpg',
        name: 'Tokyo',
        description: 'very beautiful and good',
        price: 9.99,
        category: 'sushi'
    }),
    new Product({
        image: '/images/products/tsunami.jpg',
        name: 'Tsunami',
        description: 'big wave of tasty flows into your mouth when eating it',
        price: 7.99,
        category: 'sushi'
    }),
    new Product({
        image: '/images/products/coke.jpg',
        name: 'Coke',
        description: 'refreshing Product to boost up your thirst. everyone enjoys coke anywhere and anytime',
        price: 0.99,
        category: 'drink'
    }),
    new Product({
        image: '/images/products/juice.jpg',
        name: 'Juice',
        description: 'just arrive from farm picking. it nourishes your body and soul with watering and juicy fruit',
        price: 3.99,
        category: 'drink'
    }),
    new Product({
        image: '/images/products/cr7.jpg',
        name: 'Cr7',
        description: 'donot know what it is. but it has a cool name that sounds like coming from alien planet',
        price: 3.99,
        category: 'drink'
    }),
    new Product({
        image: '/images/products/monster.jpg',
        name: 'Monster',
        description: 'cool tea Product. it leads you into a new taste world that you haver never taste. monster flavor to wake you up',
        price: 1.53,
        category: 'drink'
    }),
    new Product({
        image: '/images/products/redbull.jpg',
        name: 'Redbull',
        description: 'energy Product to charge you up like hit by a red bull. watch around you to not be hit by a bull',
        price: 2.99,
        category: 'drink'
    })
];

var done = 0;
for (var i=0; i<products.length; i++) {
    console.log("i: ", i);
    products[i].save(function(err, result) {
        done++;
        if (done === products.length) {
//            alert("Hi");
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}
