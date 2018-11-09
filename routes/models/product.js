var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({        // Schema Property
  name: {type: String, required: true, trim: true},
  price: {type: Number, required: true},
  description: {type: String, required: true, trim: true},
  image: {type: String, required: true, trim: true},
  category: {type: String, required: true, trim: true}
});

var Product = mongoose.model('Product', ProductSchema);

module.exports = {Product};
