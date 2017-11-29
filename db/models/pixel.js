var mongoose = require('mongoose');

var pixelSchema = mongoose.Schema({
  Color: {
    red: {type: Number, min: 0, max: 255},
    green: {type: Number, min: 0, max: 255},
    blue: {type: Number, min: 0, max: 255},
    default: {red: 0, green: 0, blue: 0}
  },
  Width: {
    type: Number,
    min: 1,
    max: 30
  },
  X: {
    type: Number,
    required: true
  },
  Y: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Drawing', pixelSchema);
