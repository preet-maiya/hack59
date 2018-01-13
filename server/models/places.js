var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var placeSchema = new Schema({
  address: String,
  latitude: Number,
  longitude: Number,
  rating: Number,
  numberOfSafetyRating: Number,
  numberOfGenRating: Number,
  description: String,
  safety: Number,
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
  complaints: [{type: Schema.Types.ObjectId, ref: 'Complaint'}]
});

module.exports.places = mongoose.model('Place', placeSchema);
