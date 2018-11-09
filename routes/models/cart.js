module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
    this.pickupLoc = oldCart.pickupLoc || 'Restaurant';
    
    this.add = function(item, id) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {item: item, qty: 0, price: 0}
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    }
    
    this.generateArray = function() {
        var arr = [];
        for (var id in this.items) {
            var repeat = 0;
            var oneprice = 0;
            if (this.items[id].qty > 1) {
                repeat = this.items[id].qty;
                oneprice = this.items[id].price / this.items[id].qty;
                var newObj = {item: this.items[id].item, qty: 1, price: oneprice};
                for (var j=0; j<repeat; j++ ) {
                    arr.push(newObj);
                }
            } else {
                arr.push(this.items[id]);
            }
        }
        return arr;
    }
    this.stringifyName = function() {
        var name = "";
        for (var id in this.items) {
            name += this.items[id].item.name + " - " + this.items[id].qty + " - " + this.items[id].price + " // ";
        }
        return name;
    }
}