var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var commentSchema = new Schema({
  user: String,
  description: String,
  date: Date
});

module.exports.comments = mongoose.model('Comment', commentSchema);
