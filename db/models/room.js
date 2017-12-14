var mongoose = require('mongoose');
var UserSchema = require('./user').schema;
var DrawingSchema = require('./drawing').schema;
var ScoreBoardSchema = require('./scoreboard').schema;

var roomSchema = mongoose.Schema({
  Name: {
    type: String,
    required: true
  },
  Owner: {
    type: String,
    required: true
  },
  Members: [UserSchema],
  Playing: Boolean,
  PastDrawings: [DrawingSchema],
  CurrDrawing: DrawingSchema,
  ScoreBoard: ScoreBoardSchema
});

module.exports = mongoose.model('Room', roomSchema);
