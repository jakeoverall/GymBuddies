var express = require('express'),
  sessions = require('express-session'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  MongoStore = require('connect-mongo')(sessions),
  db = require('./server-assets/db'),
  app = express(),
  port = process.env.PORT || 3000;

//Sets up the root directory for our server
app.use(express.static(__dirname + '/public'));

//Handles user sessions
app.use(cookieParser());
app.use(bodyParser.json());
app.use(sessions({
  secret: 'shhh... this is a secret',
  resave: false,
  saveUninitialized: true,
  name: 'GymBuddies',
  store: new MongoStore({
    url: 'mongodb://localhost/GymBuddiesSessionStore'
  })
}));

// var jake = new db.user({
//   firstName: "Jake",
//   lastName: "Overall",
//   password: "Bananans",
//   email: "joverall22@gmail.com"
//  }).save();

//Starts the server listening on the specified port
app.listen(port, function(){
  console.log('Listening at localhost on port: ', port);
});