const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    name: String,
    email: String,
    password: String,
},{collection: 'users'})

const User = mongoose.model('User', userSchema);

module.exports = User;