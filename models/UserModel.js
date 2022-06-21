const mongoose = require('mongoose');

const User = new mongoose.Schema({
    name:String,
    email:{
        type:String,
        unique:true
    },
    password:String
});

const Post = mongoose.model('Post', User);

module.exports = Post;