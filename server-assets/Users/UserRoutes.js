var db = require('../db');

function _find (email, cb){
  db.users.findOne({email: email}, function(err, user){
    if(err){
      return cb(err);
    }
    return cb(null, user);
  });
}

function login (req, res){
  db.users.findOne({ email: req.body.email}, function(err, user){
    if(err){
      return res.status(401).send(err);
    }
    user.validatePassword(req.body.password, function(err, valid){
      if(err){
        return res.status(401).send(err);
      } else if(valid){
        req.session.email = user.email;
        req.session.user = user;
        req.session.friendsPosts = {
          data: [],
          updated: ''
        }
        return res.status(200).send(user);
      } else {
        return res.status(404).send({
          message: 'Sorry for the inconvience, an unexpected error has occured please try again'
        });
      }
    });
  });
}

function register (req, res){
  var newUser = new db.user(req.body.user).save(function(err){
    if(err){
      return res.status(401).send(err);
    }
      return login({body: newUser}, res);
    //return res.status(200).send(newUser);
  });
}

function updateUser (req, res) {
  if(req.body.user.email === req.session.email){
    _find(req.body.user.email, function(err, user){
      if(err){
        return res.status(401).send(err);
      }
      for(var key in req.body.user){
        if(key !== 'socialDetails'){
          if(key !== 'privateDetails'){
            if(user[key] !== req.body.user[key]){
               user[key] = req.body.user[key];
            }
          } else {
            for(var k in req.body.user.privateDetails){
              if(user.privateDetails[k] !== req.body.user.privateDetails[k]){
                 user.privateDetails[k] = req.body.user.privateDetails[k];
              }
            }
          }
        }
      }
      user.save(function(err){
      if(err){
        return res.status(400).send(err);
      }
      return res.status(200).send(user);
      });
    });
  } else {
    req.session.destroy(function(err){
      if(err){
        console.log(err);
      }
      res.redirect('/login');
    });
  }
}

function logout (req, res){
  req.session.destroy(function(err){
    if(err){
        console.log(err);
      }
      res.redirect('/login');
  });
}

module.exports = {
  login: login,
  register: register,
  updateUser: updateUser,
  logout: logout
};