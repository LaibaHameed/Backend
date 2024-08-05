const mongoose = require('mongoose');

mongoose.connect(`mongodb://localhost:27017/testingdatabase`);

let userSchema = mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    posts: [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'post'
        }
    ]
});

// jb userSchema dosery schema mai use krty hain toh "user" is name se karin gy 
// ye ik qisam ka table ka name hai.
module.exports = mongoose.model("user" , userSchema );