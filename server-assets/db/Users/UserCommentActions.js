var Users = require('./UserModel'),
    Comments = require('../Comments/CommentModel');


function _validateAuthor(req, cb){
  if(!req.session){
    return cb();
  }
  if(req.session.email === req.body.email){
    Users.findOne({email: req.body.email}, function(err, user){
      if(err){
        return cb(err);
      }
      return cb(null, user);
    });
  } else {
    return cb({err: 'Whoops something broke try again'});
  }
}

function createComment(req, res){
  _validateAuthor(req, function(err, user){
    if(err){
      return res.send(err);
    } else if(user){
      var newComment = new Comment(req.body.Comment);
      newComment.author = user._id;
      newComment.save(function(err){
        if(err){
          return res.send(err);
        }
        user.comments.addToSet(newComment);
        user.save(function(err){
          if(err){
            return res.send(err);
          }
          return res.send({message: 'Comment Successful'});
        });
      });
    } else {
      return res.send({message: 'Please sign in before Commenting'});
    }
  });
}

function updateComment (req, res){
  _validateAuthor(req, function(err, user){
    if(err){
      return res.send(err);
    } else if(user){
      Comments.findOneAndUpdate({_id: req.body.Comment._id}, req.body.Comment, function(err, Comment){
        Comment.save(function(err){
          if(err){
            return res.send(err);
          }
          return res.send({message: 'Comment updated'});
        });
      });
    } else {
      return res.send({message: 'Please sign in before editing your Comment'});
    }
  });
}

function deleteComment (req, res){
  _validateAuthor(req, function(err, user){
    if(err){
      return res.send(err);
    } else if(user){
      Comments.findOne({_id: req.body.Comment.id}, function(err, Comment){
        Comment.remove(function(err){
          if(err){
            return res.send(err);
          }
          return res.send({message: 'Comment Removed'});
        });
      });
    } else {
      return res.send({message: 'Please sign in before editing your Comment'});
    }
  });
}

function likeComment (req, res){
  _validateAuthor(req, function(err, user){
    if(err){
      return res.send(err);
    } else if(user){
      Comments.findOne({_id: req.body.Comment.id}, function(err, comment){
        comment.likes.addToSet(user._id);
        comment.save(function(err){
          if(err){
            return res.send(err);
          }
          user.likes.addToSet(comment._id);
          user.save(function(err){
            if(err){
              return res.send(err);
            }
            return res.send({message: 'Comment Liked'});
          });
        });
      });
    } else {
      return res.send({message: 'Please sign in before liking a Comment'});
    }
  });
}

module.exports = {
  create: createComment,
  update: updateComment,
  delete: deleteComment,
  like: likeComment
};