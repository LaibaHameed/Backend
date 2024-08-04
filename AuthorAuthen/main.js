const express = require('express');
const app = express();
const path = require('path');
const userModel = require("./models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    res.render('index');
});

// sign up
app.post('/create', (req, res) => {
    try {
        // main code

        const { username, email, password, age } = req.body;

        bcrypt.hash(password, 10, async (err, hash) => {
            const createdUser = await userModel.create({
                username,
                email,
                password: hash,
                age
            });

            let token = jwt.sign({ email }, "sercretKey");
            res.cookie("token", token);
            res.send(createdUser);
        })

        // main code
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// loggin
app.get("/login", (req, res) => {
    res.render('login');
})
app.post("/login", async (req, res) => {
    let user = await userModel.findOne({ email: req.body.email });
    console.log(user);
    if (!user) return res.send("something went wrong!");

    let userPass = req.body.password;
    let encrypt = user.password;
    bcrypt.compare(userPass, encrypt, (err, result) => {
        if (result) {
            let token = jwt.sign({ email: user.email }, "sercretKey");
            res.cookie("token", token);
            res.send("you are logged in! ");
        } else {
            res.send("you can't login");
        }
    })
})

// logout
app.get('/logout', (req, res) => {
    res.render('logout');
})
app.post('/logout', async (req, res) => {
    let user = await userModel.findOne({ email: req.body.email });
    if (user) {
        res.cookie('token', '');
        res.send("you are log out");
    } else {
        res.send("you not log in");
    }
})


app.get('/users', async (req,res)=>{
    let users = await userModel.find();
    res.render('users', {users});
});

app.get('/delete/:id', async (req, res)=>{
    await userModel.findOneAndDelete({_id : req.params.id});
    res.redirect('/users');
})

app.listen(3033, () => {
    console.log('Server is running on port 3033');
});
