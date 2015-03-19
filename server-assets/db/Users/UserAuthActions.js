var Users = require('./UserModel'),
    validator = require('../../config/modules').validator;

function _sanitize(body) {
  if(typeof body === 'object'){
    for (var k in body) {
      if(typeof body[k] === 'object'){
        for(var j in body[k]){
          body[k][j] = validator.toString(body[k][j]);
        }
      } else {
        body[k] = validator.toString(body[k]);
      }
    }
  } else {
    body = validator.toString(body);
  }
  return body;
}

function _find(email, cb) {
    Users.findOne({
        email: email
    }, function (err, user) {
        if (err) {
            return cb(err);
        }
        return cb(null, user);
    });
}

function login(req, res) {
  req.body = _sanitize(req.body);
  req.body.email = validator.normalizeEmail(req.body.email);
  Users.findOne({
    email: req.body.email
  }, function (err, user) {
    if (err) {
        return res.send(err);
      }
      if(user){
        user.validatePassword(req.body.password, function (err, valid) {
            if (err) {
                return res.send(err);
            } else if (valid) {
                req.session.email = user.email;
                if (user.email === 'IamAnAdmin@gymbuddies.com') {
                  req.session.isAdmin = true;
                }
                user.password = '';
                req.session.user = user;
                return res.status(200).send(req.session.user);
                } else {
                return res.send({err: 'User not found please try again'});
            }
        });
    } else {
        return res.send({err: 'User not found please try again'});
    }
  });
}

function register(req, res) {
  req.body = _sanitize(req.body);
  req.body.user.email = validator.normalizeEmail(req.body.user.email);
  var newUser = new Users(req.body.user);
  newUser.save(function (err) {
      if (err) {
          return res.send(err);
      }
      newUser.password = '';
      req.session.user = newUser;
      req.session.email = req.body.user.email;
      return res.status(200).send({ message: 'User registration successful'});
    });
};

function update(req, res) {
    if(!req.session.user){
        return res.send({message: 'You must login before making changes to your account'});
    }
    req.body = _sanitize(req.body);
    _find(req.session.user.email, function (err, user) {
        if (err) {
            return res.send(err);
        }
        user.firstName = req.body.user.firstName || user.firstName;
        user.lastName = req.body.user.lastName || user.lastName;
        user.email = req.body.user.email || user.email;
        user.save(function (err) {
            if (err) {
                return res.send(err);
            }
            req.session.user = user;
            req.session.updatedUser = true;
            return res.status(200).send({message: 'Successfully updated'});
        });
    });
}

function logout(req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        }
        return res.status(200).send({redirectState:'login'});
    });
}

function isAdmin (req, res){
    console.log(req.session);
    if(req.session.isAdmin){
      return res.status(200).send(req.session.user);
    }
    return res.send({err: 'please login to continue'});
}

function authenticate (req, res){
    if(req.session.user){
        if(req.session.updatedUser){
            Users.findOne({'email': req.session.user.email}, function(err, user){
                    if(err){
                        req.session.destroy();
                        return res.send({message: 'An error occured please log back in to continue'});
                    }
                    user.password = '';
                    req.session.user = user;
                    return res.status(200).send(req.session.user);
                });
        } else {
            return res.status(200).send(req.session.user);
        }
    } else{
        return res.send({err: 'unable to authenticate user'});
    }
}

module.exports = {
    login: login,
    register: register,
    logout: logout,
    update: update,
    isAdmin: isAdmin,
    authenticate: authenticate
};