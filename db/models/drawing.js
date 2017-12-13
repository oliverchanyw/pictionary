var mongoose = require('mongoose');
var PixelSchema = require('./pixel').schema;

var drawingSchema = mongoose.Schema({
  Labels: {
    type: [String],
    required: true
  },
  Image: [PixelSchema]
});

module.exports = mongoose.model('Drawing', drawingSchema);
