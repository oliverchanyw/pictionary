var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  Name: {
    type: String,
    required: true
  },
  Password: {
    type: String,
  },
  Timein: {
    type: Date,
    required: true
  }
});

var User = mongoose.model('User', userSchema);

module.exports = User;
