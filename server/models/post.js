const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    description: String,
    userId: String,
    urlImage: String,
    likes: Number,
    comments: Number
}, {collection: 'posts'})

const Post = mongoose.model('Post', postSchema);

module.exports = Post;