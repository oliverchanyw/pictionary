var User = require('./models/user');
var Drawing = require('./models/drawing');
var Room = require('./models/room');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/cis197hw6', function (err) {
  if (err && err.message.includes('ECONNREFUSED')) {
    console.log('Error connecting to mongodb database: %s.\nIs "mongod" running?', err.message);
    process.exit(0);
  } else if (err) {
    throw err;
  } else {
    console.log('DB successfully connected.');
  }
});


// --------------------------------------------------------------- //
// -------------------------- FUNCTIONS -------------------------- //
// --------------------------------------------------------------- //

var addNewRoom = function (roomID, cb) {

};

var activeRoom = function (roomID, pass, fail) {

};

var credentialsAreValid = function (username, password, pass, fail) {
  User.findOne({Name: username, Password: password}, function(e, user) {
   if (e) throw e;
   if (!user) fail();
   if (user) pass();
 });
};

var addNewUser = function (username, password, pass, fail) {
  var newUser = new User({
    Name: username,
    Password: password,
    Timein: Date.now()
  });

  newUser.save(function (e) {
    if (e) {
      fail();
    } else {
      pass();
    }
  })
};

var joinRoom = function (roomID, username, cb) {

};

var leaveRoom = function (roomID, username, cb) {

};

var db = mongoose.connection;

module.exports = {
  User: User,
  Drawing: Drawing,
  Room: Room,
  mongoose: mongoose,
  addNewRoom: addNewRoom,
  activeRoom: activeRoom,
  credentialsAreValid: credentialsAreValid,
  addNewUser: addNewUser,
  joinRoom: joinRoom,
  leaveRoom: leaveRoom
};
