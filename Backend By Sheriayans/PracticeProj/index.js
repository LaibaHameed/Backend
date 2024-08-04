const express = require('express');
const path  = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, '/Public')));
app.set('view engine', 'ejs');

app.get('/', (req, res)=>{
    res.render("index");
})
app.get('/profile/:username', (req, res)=>{
    res.send(`Welcome, ${req.params.username}`);
})
app.get('/profile/:username/:lastname', (req, res)=>{
    res.send(req.params);
})

app.listen(3000, ()=>{
    console.log("its running");
});