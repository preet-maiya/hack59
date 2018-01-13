var User = require('../models/users').users;

module.exports.login = function(req, res) {
  console.log(req.body);
  User.findOne({userid: req.body.userid}, function(err, result) {
    if(err) {
      console.log("Error logging in:");
      console.log(err);
      res.end();
    }
    if(!result) {
      res.send({success: false, reason: "Wrong userid"});
    }
    else if(result.password==req.body.password) {
      res.send({success: true, reason: "Success"});
    }
    else {
      res.send({success: false, reason: "Wrong password"});
    }
  })
}

module.exports.register = function(req, res) {
  User.findOne({userid: req.body.userid}, function(err, result) {
    if(err) {
      console.log(err);
      res.end();
    }
    else {
      if(result) {
        res.send({success: false, reason: "User id exists"});
      }
      else {
        var new_user = {
          userid: req.body.userid,
          password: req.body.password,
          email: req.body.password
        }
        var user = new User(new_user);
        user.save(function(err, result) {
          if(err) {
            console.log(err);
            res.end();
          }
          else {
            res.send({success: true, reason: "Success"});
          }
        })
      }
    }
  })
}
