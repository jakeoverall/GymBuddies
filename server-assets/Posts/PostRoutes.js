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
        //TODO: shouldn't have to loop through with likes being unique will test
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

function getPublicPosts (req, res){
  _validateAuthor(req, function(err, user){
    if(err){
      return res.status(400).send(err);
    } else if(user){
      db.posts.sort({_id: -1}).limit(100).find({
        share: 'Public',
        posted: { $lt: req.body.after || Date.now()}
      }).populate({
        path: 'comments',
        select: '-_id',
        options: {
          limit: req.body.moreComments || 50
        }
      }).exec(function(err, posts){
        if(err){
          return res.send(err);
        }
        return res.status(200).send(posts);
      });
    } else {
      return res.redirect('/login');
    }
}

function getFriendsPosts (req, res){
  _validateAuthor(req, function(err, user){
    if(err){
      return res.status(400).send(err);
    } else if(user){
      if(req.session.friendsPosts.updated < Date.now() - 600000){
        req.session.friendsPosts.updated =  Date.now();
        for(var i = 0; i < user.friends.length; i++){
          db.posts.sort({_id: -1}).limit(50).find({
            share: 'Friends',
            author: user.friends[i],
            posted: { $lt: req.body.after || Date.now()}
          }).populate({
            path: 'comments',
            select: '-_id',
            options: {
              limit: req.body.moreComments || 50
            }
          }).exec(function(err, posts){
          if(err){
            return res.send(err);
          }
            req.session.friendsPosts.data.push(posts);
          });
        }
          return res.status(200).send(posts);
        });
      }
    } else {
      req.session.destroy();
      return res.redirect('/login');
    }
}

module.exports = {
  create: createPost,
  update: updatePost,
  delete: deletePost,
  like: likePost,
  get: getPublicPosts
};