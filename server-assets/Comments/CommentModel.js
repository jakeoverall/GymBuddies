var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.Types.ObjectId;

var Comment = new Schema({
  title: {type: String},
  body: {type: String, required: true},
  posted: {type: Date, required: true, default: new Date()},
  post: {type: ObjectId, required: true, ref: 'Post'},
  author: {type: ObjectId, required: true, ref: 'User'},
  likes: [{type: ObjectId, ref: 'User'}],
  comments: [{type: ObjectId, ref: 'Comment'}]
});

module.exports = mongoose.model('Comment', Comment);