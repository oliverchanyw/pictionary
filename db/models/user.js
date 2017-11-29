var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  Name: {
    type: String,
    required: true,
    unique: true
  },
  Timein: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Room', roomSchema);
