var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userSchema = new Schema ({
    userid: {type: String, index: {unique: true, dropDups: true}},
    password: String,
    email: String
});

module.exports.users = mongoose.model('User', userSchema);
