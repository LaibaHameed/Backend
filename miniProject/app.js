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

app.get('/', (req, res) => {
    res.render('index');
});

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

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).send("Invalid email or password");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).send("Invalid email or password");

    const token = jwt.sign({ email: email, userid: user._id }, "secretkey");
    res.cookie('token', token);
    res.redirect('/profile');
});

app.get('/logout', (req, res) => {
    res.cookie("token", "", { maxAge: 0 });
    res.redirect('/login');
});

let isLoggedIn = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/login');
    }

    try {
        const data = jwt.verify(token, "secretkey");
        req.user = data;
        next();
    } catch {
        return res.status(401).send("Invalid token");
    }
}

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
    
    res.render('profile', { user });
});

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
    } catch (error) {
        res.send(error);
    }

    res.redirect('/profile');
});

app.get('/like/:id', isLoggedIn, async (req, res) => {
    let post = await postModel.findById(req.params.id).populate("user");
    if(post.likes.indexOf(req.user.userid) === -1){
        post.likes.push(req.user.userid);
    }else{
        post.likes.splice(post.likes.indexOf(req.user.userid), 1);
    }
    await post.save();
    res.redirect('/profile');
});

app.get('/edit/:id', isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({_id : req.params.id}).populate("user");
    res.render('edit', {post});
});

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

