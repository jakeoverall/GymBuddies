var mongoose = require('mongoose'),
  Comments = require('../Comments/CommentModel'),
  Schema = mongoose.Schema,
  ObjectId = Schema.Types.ObjectId;

var Post = new Schema({
  title: {type: String},
  body: {type: String, required: true},
  posted: {type: Date, required: true, default: new Date()},
  share: {type: String, enum: ['Friends', 'Public', 'Private'], required: true, default: 'Public'},
  author: {type: ObjectId, required: true, ref: 'User'},
  likes: [{type: ObjectId, ref: 'User', unique: true}],
  comments: [{type: ObjectId, ref: 'Comment'}]
});


//Cascade Delete Comments
Post.pre('remove', function(next) {
    Comments.remove({post: this._id}).exec();
    next();
});

module.exports = mongoose.model('Post', Post);