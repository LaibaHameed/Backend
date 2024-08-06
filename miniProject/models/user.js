const mongoose = require('mongoose');

mongoose.connect(`mongodb://localhost:27017/minidb`);

let userSchema = mongoose.Schema({
    username : {
        type : String
    },
    name : {
        type : String
    },
    email : {
        type : String
    },
    password : {
        type : String
    },
    posts : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref  : 'post'
        }
    ]
});

module.exports = mongoose.model("user", userSchema);