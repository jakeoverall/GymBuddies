var Users = require('./UserModel'),
    Posts = require('../Posts/PostModel');


function _validateAuthor(req, cb){
  if(!req.session){
    return cb();
  }
  if(req.session.user.email === req.body.post.email){
    Users.findOne({email: req.session.user.email}, function(err, user){
      if(err){
        return cb(err);
      }
      return cb(null, user);
    });
  } else {
    return cb({err: 'Whoops something broke try again'});
  }
}

//keep your code DRY
function _resolver(res, err, doc, cb){
  if(err){
    return res.send(err);
  } else if (doc){
    return cb(doc);
  } else {
    return res.send({message: 'Sorry nothing was found'});
  }
}

function createPost(req, res){
  _validateAuthor(req, function(err, user){
    if(err){
      return res.send(err);
    } else if(user){
      var newPost = new Posts(req.body.post);
      newPost.author = user._id;
      newPost.save(function(err){
        if(err){
          return res.send(err);
        }
        user.posts.addToSet(newPost);
        user.save(function(err){
          if(err){
            return res.send(err);
          }
          return res.send({message: 'Post Successful'});
        });
      });
    } else {
      return res.send({message: 'Please sign in before posting'});
    }
  });
}

function updatePost (req, res){
  _validateAuthor(req, function(err, user){
    if(err){
      return res.send(err);
    } else if(user){
      Posts.findOneAndUpdate({_id: req.body.post._id}, req.body.post, function(err, post){
        _resolver(res,err, post, function(postDoc){
            postDoc.save(function(err){
            if(err){
              return res.send(err);
            }
            return res.send({message: 'Post updated'});
          });
        });
      });
    } else {
      return res.send({message: 'Please sign in before editing your post'});
    }
  });
}

function deletePost (req, res){
  _validateAuthor(req, function(err, user){
    if(err){
      return res.send(err);
    } else if(user){
      Posts.findOne({_id: req.body.post._id}, function(err, post){
        _resolver(res, err, post, function(postDoc){
          postDoc.remove(function(err){
            return res.send({message: 'Post Removed'});
          })
        })
      });
    } else {
      return res.send({message: 'Please sign in before editing your post'});
    }
  });
}

function likePost (req, res){
  _validateAuthor(req, function(err, user){
    if(err){
      return res.send(err);
    } else if(user){
      Posts.findOne({_id: req.body.post.id}, function(err, post){
        post.likes.addToSet(user._id);
        post.save(function(err){
          if(err){
            return res.send(err);
          }
          user.likes.addToSet(post._id);
          user.save(function(err){
            if(err){
              return res.send(err);
            }
            return res.send({message: 'Post Liked'});
          });
        });
      });
    } else {
      return res.send({message: 'Please sign in before liking a post'});
    }
  });
}

module.exports = {
  create: createPost,
  update: updatePost,
  delete: deletePost,
  like: likePost
};