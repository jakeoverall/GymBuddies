//get types of posts
var Posts = require('./PostModel');

function getPosts(req, res){
  Posts.find({}, function(err, posts){
    if(err){
      return res.send(err);
    }
    return res.send(posts);
  })
}

module.export = {
  get: getPosts
}