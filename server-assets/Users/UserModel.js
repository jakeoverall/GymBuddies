var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.Types.ObjectId,
  bcrypt = require('bcryptjs'),
  SALT_FACTOR = 10;

var User = new Schema({
  firstName: {type: String, required: true, trim: true},
  lastName: {type: String, required: true, trim: true},
  email: {type: String, required: true, unique: true, trim: true},
  hideEmail: {type: Boolean, required: true, default: true},
  password: {type: String, required: true, trim: true},
  joined: {type: Date, required: true, default: new Date()},
  privateDetails: {
    height: {type: String, trim: true},
    weight: [{type: String, trim: true}],
    bmi: {type: String, trim: true}
  },
  socialDetails: {
    friends: [{type: ObjectId, ref: 'User'}],
    posts: [{type: ObjectId, ref: 'Post'}],
    comments: [{type: ObjectId, ref: 'Comment'}],
    likes: [{type: ObjectId, ref: 'Like'}]
  }
});

User.pre('save', function(next){
var user = this;
  if(!user.isModified('password')){
    return next();
  }
  bcrypt.genSalt(SALT_FACTOR, function(err, salt){
    if(err){
      return next(err);
    } else {
      bcrypt.hash(user.password, salt, function(err, hash){
        user.password = hash;
        next();
      });
    }
  });
});

User.methods.validatePassword = function(password, cb){
  bcrypt.compare(password, this.password, function(err, isMatch){
    if(err){
      return cb(err);
    }
    return cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', User);