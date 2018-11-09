var makeChunk = function(arry, chunk_size) {
    var arryChunk = [];
    for (var i=0; i<arry.length; i += chunk_size) {
        arryChunk.push(arry.slice(i, i+chunk_size));
    }
    return arryChunk;
}

module.exports = {makeChunk};

