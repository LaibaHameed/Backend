const express = require('express');
const app = express();
const userModel = require('./usermodel')

app.get('/', (req, res) => {
    res.send('hello??');
});

app.get('/create', async (req, res) => {
    const createdUser = await userModel.create({
        name : "Maraim Iqbal",
        username : "mariam014",
        email : "mariam014@gmail.com",
    });
    res.send(createdUser);
});

// find({username : "laiba012"}) , find gives us the array , and findOne({username : "laiba012"}) gives us object
app.get('/read', async (req, res) => {
    const users = await userModel.find();
    res.send(users);
});

app.get('/update', async (req, res) => {
    const updatedUser = await userModel.findOneAndUpdate({username : "laiba012"}, {name : "Laiba Hameed"}, {new: true});
    res.send(updatedUser);
});

app.get('/delete', async (req, res) => {
    const deletedUser = await userModel.findOneAndDelete({username : "laiba012"});
    res.send("this user " + deletedUser + " has been deleted");
});

app.listen(3000);