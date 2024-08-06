const mongoose = require('mongoose');
const user = require('./user');

let userPost = mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    content : {
        type : String
    },
    date : {
        type : Date,
        default : Date.now()
    },
    likes : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'user'
        }
    ]
});

module.exports = mongoose.model("post", userPost);