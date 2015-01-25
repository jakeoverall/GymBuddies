var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.Types.ObjectId;

var Like = new Schema({  
  post: {type: ObjectId, ref: 'Post'},
  comment: {type: ObjectId, ref: 'Comment'},
  user: {type: ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Like', Like);