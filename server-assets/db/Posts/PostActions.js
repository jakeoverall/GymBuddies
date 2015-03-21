//get types of posts
var Posts = require('./PostModel');

function getPosts(req, res){
  Posts.find({share: 'Public'}).populate('author', 'name email').populate('comments', 'author body comments likes').exec(function(err, posts){
    if(err){
      return res.send(err);
    }
    return res.send(posts);
  })
}

module.exports = {
  get: getPosts
}