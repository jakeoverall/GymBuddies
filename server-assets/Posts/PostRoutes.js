var db = require('../db');

function _validateAuthor(req, cb){
  if(req.session.email === req.body.email){
    db.users.findOne({email: req.body.email}, function(err, user){
      if(err){
        return cb(err);
      }
      return cb(null, user);
    });
  } else {
    return cb();
  }
}

function createPost(req, res){
  _validateAuthor(req, function(err, user){
    if(err){
      return res.status(400).send(err);
    } else if(user){
      var newPost = new db.post(req.body.post);
      newPost.author = user._id;
      newPost.save(function(err){
        if(err){
          return res.send(err);
        }
        user.socialDetails.posts.addToSet(newPost);
        user.save(function(err){
          if(err){
            return res.send(err);
          }
          return res.status(200).send({message: 'Post Successful'});
        });
      });
    } else {
      return res.status(401).send({message: 'Please sign in before posting'});
    }
  });
}

function updatePost (req, res){
  _validateAuthor(req, function(err, user){
    if(err){
      return res.status(400).send(err);
    } else if(user){
      db.posts.findOne({_id: req.body.post._id}, function(err, post){
        post.title = req.body.post.title;
        post.body = req.body.post.body;
        post.share = req.body.post.share;
        post.save(function(err){
          if(err){
            return res.status(400).send(err);
          }
          return res.status(200).send({message: 'Post updated'});
        });
      });
    } else {
      return res.status(401).send({message: 'Please sign in before editing your post'});
    }
  });
}

function deletePost (req, res){
  _validateAuthor(req, function(err, user){
    if(err){
      return res.status(400).send(err);
    } else if(user){
      db.posts.findOne({_id: req.body.post.id}, function(err, post){
        post.remove(function(err){
          if(err){
            return res.status(400).send(err);
          }
          return res.status(200).send({message: 'Post Removed'});
        });
      });
    } else {
      return res.status(401).send({message: 'Please sign in before editing your post'});
    }
  });
}

function likePost (req, res){
  _validateAuthor(req, function(err, user){
    if(err){
      return res.status(400).send(err);
    } else if(user){
      db.posts.findOne({_id: req.body.post.id}, function(err, post){
        for (var i = 0; i < post.likes.length; i++) {
          if(post.likes[i] === user._id){
            return res.status(400).send({message: 'unable to like again'});
          }
        }
        post.likes.addToSet(user._id);
        post.save(function(err){
          if(err){
            return res.status(400).send(err);
          }
          return res.status(200).send({message: 'Post Liked'});
        });
      });
    } else {
      return res.status(401).send({message: 'Please sign in before liking a post'});
    }
  });
}

module.exports = {
  create: createPost,
  update: updatePost,
  delete: deletePost,
  like: likePost
};