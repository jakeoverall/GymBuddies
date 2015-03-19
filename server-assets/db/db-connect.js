var mongoose = require('mongoose'),
  connection = mongoose.connection,
  Users = {
    auth: require('./Users/UserAuthActions'),
    posts: require('./Users/UserPostActions'),
    comments: require('./Users/UserCommentActions')
  },
  Posts = require('./Posts/PostActions'),
  connectionString = process.env.DBCONNECT || 'mongodb://localhost/GymBuddies';

mongoose.connect(connectionString);

connection.once('open', function(){
  console.log('successfully connected to MongoDb at: ' + connectionString);
});

module.exports = {
  users: Users,
  posts: Posts
};