var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.Types.ObjectId;

var Post = new Schema({
  title: {type: String},
  body: {type: String, required: true},
  posted: {type: Date, required: true, default: new Date()},
  share: {type: String, enum: ['Friends', 'Public', 'Private'], required: true, default: 'Private'},
  author: {type: ObjectId, required: true, ref: 'User'},
  likes: [{type: ObjectId, ref: 'User', unique: true}],
  comments: [{type: ObjectId, ref: 'Comment'}]
});

module.exports = mongoose.model('Post', Post);