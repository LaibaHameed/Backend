const express = require('express');
const app = express();
const userModel = require('./models/user');
const postModel = require('./models/post');

app.get('/', (req, res)=>{
    res.send("okay done");
});

// create user
app.get('/create' , async (req, res)=>{
    let user = await userModel.create({
        username: "Laiba",
        email : "laiba012@gamil.com"
    });
    res.send(user);
});

// create post
app.get('/post/create' , async (req,res)=>{
    // post creation
    let post = await postModel.create({
        postData : "hey we are motivated to see what happend next",
        user : "66b0ce253bf9c278a11e9f9b"
    });
    // find user id and put post id in posts array in user object
    let user = await userModel.findOne({_id: "66b0ce253bf9c278a11e9f9b"});
    user.posts.push(post._id);
    // changes  save
    await user.save();

    res.send({post, user});
})

app.listen(3000, (req, res)=>{
    console.log("your app is listening on port 3000");
});