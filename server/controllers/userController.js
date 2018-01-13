var Place = require('../models/places').places;
var User = require('../models/users').users;
var Comment = require('../models/comments').comments;
var Media = require('../models/comments').media;
var Complaint = require('../models/complaints').complaints;
var url = require('url');


module.exports.myPlace = function(req, res) {
  var url_parts = url.parse(req.url, true);
  var mylat = url_parts.query.latitude;
  var mylong = url_parts.query.longitude;
  var myaddr = url_parts.query.address;
  Place.findOne({latitude: mylat, longitude: mylong}).populate([{
    path: 'comments',
    model: 'Comment'
  }, {
    path: 'complaints',
    model: 'Complaint'
  }]).exec(function(err, result) {
    if(err) {
      console.log("Failed to find my place");
      console.log(err);
    }
    else {
      if(!result) {
        var new_place = {
          latitude: mylat,
          longitude: mylong,
          address:  myaddr,
          rating: 0,
          safety: 0,
          numberOfSafetyRating: 0,
          numberOfGenRating: 0
        }
        var place = new Place(new_place);
        place.save(function(err, result) {
          if(err) {
            console.log("Failed to addd new place");
            console.log(err);
          }
          else {
            console.log(result);
            res.send([result]);
          }
        })
      }
      else {
        console.log(result);
        res.send([result]);
      }
    }
  })
}


module.exports.getActivity = function(req, res) {
  var mymap = new Object();
  Comment.find({}, function(err, result) {
    if(err) {
      console.log(err);
      res.end();
    }
    else {
      if(!result) res.send(mymap);
      else {
      for(var i=0;i<result.length;i++) {
        if(!result[i].date) continue;
        var thisdate = result[i].date;
        var day = thisdate.getDate();
        if(day<10) day = '0' + day;
        var month = thisdate.getMonth();
        if(month<10) month = '0' + month;
        var year = thisdate.getFullYear();
        unique = day + month + year;
        if(mymap[unique]) mymap[unique]++;
        else mymap[unique] = 1;
        if(i==result.length-1)
          res.send(mymap);
      }
    }
    }
  })
}


module.exports.listPlaces = function(req, res) {
  var url_parts = url.parse(req.url, true);
  var mylat = url_parts.query.latitude;
  var mylong = url_parts.query.longitude;
  var myaddr = url_parts.query.address;
  Place.find({}).populate([{
    path: 'comments',
    model: 'Comment'
  }, {
    path: 'complaints',
    model: 'Complaint'
  }]).exec(function(err, result) {
    if(!result) res.send({});
    else {
      var arr=[];
      for(var i=0;i<result.length;i++) {
        if(Math.abs(result[i].latitude-mylat)>=0&&Math.abs(result[i].longitude-mylong)>=0) {
          arr.push(result[i]);
        }
        if(i==result.length-1) {
          res.send(arr);
        }
      }
    }
  });
};

module.exports.generalRatePlace = function(req, res) {
  Place.findOne({ $and: [
    {latitude: req.body.latitude},
    {longitude: req.body.longitude}
  ]}, function(err, result) {
    if(err) {
      console.log("Error finding places");
      console.log(err);
    }
    else {
      var new_numberOfGenRating = result.numberOfGenRating + 1;
      var new_rating = (result.numberOfGenRating * result.rating + req.body.rate)/new_numberOfGenRating;
      Place.update({ $and: [
        {latitude: req.body.latitude},
        {longitude: req.body.longitude}
      ]}, {$set: {numberOfGenRating: new_numberOfGenRating, rating: new_rating}}, function(err, result) {
        if(err) {
          console.log("Error");
          console.log(err);
        }
        else {
          res.send(result);
        }
      })
    }
  })
}

module.exports.safetyRatePlace = function(req, res) {
  Place.findOne({ $and: [
    {latitude: req.body.latitude},
    {longitude: req.body.longitude}
  ]}, function(err, result) {
    if(err) {
      console.log("Error finding places");
      console.log(err);
    }
    else {
      var new_numberOfSafetyRating = result.numberOfSafetyRating + 1;
      var new_safety = ((result.numberOfSafetyRating * result.safety) + req.body.safety)/new_numberOfSafetyRating;
      Place.update({ $and: [
        {latitude: req.body.latitude},
        {longitude: req.body.longitude}
      ]}, {$set: {numberOfSafetyRating: new_numberOfSafetyRating, safety: new_safety}}, function(err, result) {
        if(err) {
          console.log("Error");
          console.log(err);
        }
        else {
          res.send(result);
        }
      })
    }
  })
}


module.exports.addComment = function(req, res) {
  console.log(req.body);
  var date_now = new Date();
    var new_comment = {
      user: req.body.userid,
      description: req.body.comment,
      date: date_now
    }
    var comment = new Comment(new_comment);
    comment.save(function(err, result) {
      if(err) {
        console.log("Error in saving new comment");
        console.log(err);
        res.end();
      }
      else {
        console.log(result._id);
        Place.update({ $and: [
          {latitude: req.body.latitude},
          {longitude: req.body.longitude}
        ]}, {$push: {comments: result._id}}, function(err, result) {
            if(err) {
              console.log("Failed to update comment");
              console.log(err);
              res.end();
            }
            else {
              console.log(result);
              res.send(result);
            }
        })
      }
    })
}

module.exports.addComplaint = function(req, res) {
  Place.findOne({ $and: [
    {latitude: req.body.latitude},
    {longitude: req.body.longitude}
  ]}, function(err, result) {
    if(err) {
      console.log("Failed to complaint");
      console.log(err);
    }
    else {
      if(!result) {
        console.log("Failed to detect place");
        console.log(err);
      }
      else {
        var new_complaint = {
          place: result._id,
          complaint: req.body.complaint
        }
        complaint = new Complaint(new_complaint);
        complaint.save(function(err, body) {
          if(err) {
            console.log("Failed to add new complaint");
            console.log(err);
          }
          else {
            console.log(body);
            Place.update({_id:result._id}, {$push: {complaints: body._id}}, function(err, result) {
              if(err) {
                console.log("Couldn't link");
                console.log(err);
                res.end();
              }
              else {
                res.send(body);
              }
            })
          }
        })
      }
    }
  })
}

module.exports.listComplaints = function(req, res) {
  Complaint.find({ $and: [
    {latitude: req.body.latitude},
    {longitude: req.body.longitude}
  ]}).populate({
    path: 'place',
    model: 'Place'
  }).exec(function(err, result) {
    if(err) {
      console.log("Error listing");
      console.log(err);
      res.send({});
    }
    else {
      res.send(result);
    }
  })
}
