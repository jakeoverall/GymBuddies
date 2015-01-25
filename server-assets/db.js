var mongoose = require('mongoose'),
  connection = mongoose.connection,
  Users = require('./Users/UserModel'),
  Likes = require('./Likes/LikeModel'),
  Comments = require('./Comments/CommentModel'),
  Posts = require('./Posts/PostModel');

mongoose.connect('mongodb://localhost/GymBuddies');

connection.once('open', function(){
  console.log('successfully connected to MongoDb GymBuddies');
});

module.exports = {
  user: Users,
  likes: Likes,
  comments: Comments,
  posts: Posts
};