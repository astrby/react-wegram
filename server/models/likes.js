const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likesSchema = new Schema({
    userId: String,
    postId: String,
    like: Boolean
}, {collection: 'likes'})

const Likes = mongoose.model('Likes', likesSchema);

module.exports = Likes;