
const mongoose = require('mongoose');

var FTLocationSchema = new mongoose.Schema({        // Schema Property
  day: {type: String, required: true, trim: true},
  location: {type: String, required: true, trim: true}
});

var FTLocation = mongoose.model('FTLocation', FTLocationSchema);

module.exports = {FTLocation};
