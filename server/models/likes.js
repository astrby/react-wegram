const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likesSchema = new Schema({
    userId: String,
    postId: String,
}, {collection: 'likes'})

const Likes = mongoose.model('Likes', likesSchema);

module.exports = Likes;