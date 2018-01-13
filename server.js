var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    userController = require('./server/controllers/userController'),
    loginController = require('./server/controllers/loginController');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/test');

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json())


app.use(morgan('dev'));
app.use('/', express.static(__dirname + '/client/'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

app.post('/login', loginController.login);
app.get('/api/nearby', userController.listPlaces);
app.get('/api/myplace', userController.myPlace);
app.post('/api/addcomment', userController.addComment);
app.post('/api/addcomplaint', userController.addComplaint);
app.post('/register', loginController.register);
app.post('/api/genrate', userController.generalRatePlace);
app.post('/api/saferate', userController.safetyRatePlace);


app.listen(3000, function() {
  console.log("Hello 3k");
})
