var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var mediaSchema = new Schema ({
  travelid: String,
  filename: String,
  comments: String
});

module.exports.media = mongoose.model('Media', mediaSchema);
