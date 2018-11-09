var {Product} = require('../models/product');
var {makeChunk} = require('./makeChunk');

var makeChunkForSize = function(chunkSize) {
    var sushis = [];
    var noodles = [];
    var drinks = [];
    return new Promise(function(resolve, reject) {
        Product.find(function(err, docs) {
            docs.forEach(function (item) {
                if (item.category == 'sushi') {
                    sushis.push(item);
                } else if (item.category == 'noodle'){
                    noodles.push(item);
                } else {
                    drinks.push(item);
                }
            });
            
            if (err) {
                reject(err)
            } else {
                var data = [makeChunk(sushis, chunkSize), makeChunk(noodles, chunkSize), makeChunk(drinks, chunkSize)];
                resolve(data);
            }
        });
    });
}

module.exports = {makeChunkForSize};