const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const userModel = require('./models/user');
const postModel = require('./models/post');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// home page
app.get('/', async (req, res) => {
    try {
        // Fetch all posts and populate the user field to get user information
        let posts = await postModel.find().populate("user");

        // Format each post's date
        posts.forEach(post => {
            const date = new Date(post.date);
            post.formattedDate = date.toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric'
            });
            post.formattedTime = date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            });
        });

        // Check if a user is logged in
        const token = req.cookies.token;
        let user = null;
        if (token) {
            try {
                const data = jwt.verify(token, "secretkey");
                user = await userModel.findById(data.userid);
            } catch (error) {
                console.log("Invalid token");
            }
        }

        // Render the home page with all posts and the user (if logged in)
        res.render('home', { posts, user });
    } catch (error) {
        res.send(error);
    }
});

// create account
app.get('/register', (req,res)=>{
    res.render('register');
})
app.post('/register', async (req, res) => {
    const { email, password, username, name } = req.body;
    const user = await userModel.findOne({ email });
    if (user) return res.status(400).send("User already exists");

    bcrypt.hash(password, 10, async (err, hash) => {
        const createdUser = await userModel.create({
            name,
            username,
            email,
            password: hash,
        });

        let token = jwt.sign({ email: email, userid: createdUser._id }, "secretkey");
        res.cookie('token', token);
        res.redirect("/login");
    });
});

// login account
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).redirect('/register');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).send("Invalid email or password");

    const token = jwt.sign({ email: email, userid: user._id }, "secretkey");
    res.cookie('token', token);
    res.redirect('/profile');
});

// logout account
app.get('/logout', (req, res) => {
    res.cookie("token", "");
    res.redirect('/');
});

// middleware
let isLoggedIn = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/login');
    }
    try {
        const data = jwt.verify(token, "secretkey");
        // ab jo b req jaye gi os mai ye sath ho ga, user
        req.user = data;
        next();
    } catch {
        return res.status(401).send("Invalid token");
    }
}

// access to profile
app.get('/profile', isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email }).populate("posts");
    // Format each post's date
    user.posts.forEach(post => {
        const date = new Date(post.date);
        post.formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        });
        post.formattedTime = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    });
    // Format each post's date
    res.render('profile', { user });
});

// create/post the post
app.post('/post', isLoggedIn, async (req, res) => {
    const { content } = req.body;
    let user = await userModel.findOne({ email: req.user.email });
    try {
        let post = await postModel.create({
            user: user._id,
            content: content
        });
        user.posts.push(post._id);
        await user.save();
        console.log(post);
    } catch (error) {
        res.send(error);
    }

    res.redirect('/profile');
});

// like the post
app.get('/like/:id', isLoggedIn, async (req, res) => {
    let post = await postModel.findById(req.params.id).populate("user");   
    // let post = await postModel.find({_id : req.params.id}).populate("user");
    if(post.likes.indexOf(req.user.userid) === -1){ //agr user ne phly like nahi kia howa toh add kr do
        post.likes.push(req.user.userid);
    }else{
        post.likes.splice(post.likes.indexOf(req.user.userid), 1); //else agr like kia howa hai toh id hata do
    }
    await post.save();
    res.redirect('/');
});

// when u hit edit btn
app.get('/edit/:id', isLoggedIn, async (req, res) => {
    let post = await postModel.findById(req.params.id).populate("user");  
    res.render('edit', {post});
});

// when you hit update btn
app.post('/update/:id', isLoggedIn, async (req, res) => {
    try {
        const postId = req.params.id;
        const updatedContent = req.body.content;
        // Find the post and update its content
        await postModel.findByIdAndUpdate(postId, { content: updatedContent }); 
        res.redirect('/profile');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating the post");
    }
});

// when u hit delete btn
app.get('/delete/:id', isLoggedIn, async (req, res) => {
    try {
        const postId = req.params.id;
        // Find the post and remove it
        await postModel.findByIdAndDelete(postId);
        res.redirect('/profile');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting the post");
    }
});


app.listen(3030, () => {
    console.log("App is running on port 3030");
});

