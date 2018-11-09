var {Order} = require('../models/order');
var Cart = require('../models/cart');
var Cart = require('../models/cart');
var {wordMonth} = require('./wordMonth');

var updateTodayOrders = function(res, flag) {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    Order.find({completedOrder: false, createdAt: {$gte: startOfToday}}, function(err, orders) {
        if (err) {
            return res.write('Error!');
        }
        var cart;
        var time1, time2, month, date, hour, minute;
        var orderDetails;
        orders.forEach(function(order) {
            cart = new Cart(order.cart);
            order.details = cart.stringifyName();
            order.cart.totalPrice = order.cart.totalPrice.toFixed(2);
            time1 = new Date(order.createdAt);
            month = wordMonth(time1.getMonth()+1);
            date = time1.getDate();
            hour = time1.getHours();
            minute = time1.getMinutes();
            time2 = "(" + month + "/" + date + ")" + " - (" + hour + ":" + minute + ")";
            order.time = time2;
        });
        if (flag == 'monitor') {
            res.render('admin/monitor', { title: 'UpTaste', orders: orders,  carouseDisabled: "yes", footerDisabled: 'yes', adminHeader: "yes" });
        } else {
            res.render('admin/monitor', { title: 'UpTaste', orders: orders,  carouseDisabled: "yes", footerDisabled: 'yes', adminHeader: "yes", logoOut: "yes" });
        }
    });
}

module.exports = {updateTodayOrders};