var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var complaintSchema = new Schema({
  place: {type: Schema.Types.ObjectId, ref: 'Place'},
  complaint: String
})

module.exports.complaints = mongoose.model('Complaint', complaintSchema);
