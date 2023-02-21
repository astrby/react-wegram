const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    userId: String,
    postId: String,
    comment: String
}, {collection: 'comments'});

const Comment = mongoose.model('Comments', commentSchema)

module.exports = Comment;