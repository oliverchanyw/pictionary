var mongoose = require('mongoose');

var ScoreBoardSchema = mongoose.Schema({
  RoomName: {
    type: String,
    required: true
  },
  Scores: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
});

module.exports = mongoose.model('ScoreBoard', ScoreBoardSchema);
