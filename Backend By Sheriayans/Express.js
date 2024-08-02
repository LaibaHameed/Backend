const express = require('express')
const app = express()

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// agr hm next fun nahi likhy gy toh localhost reload hi hota rhy ga, 
// means req phly app.use() ne accept ki or aggy process hi nahi ki, jb hm next() likhy gy toh wo req agy process kr de ga
app.use((req, res, next)=>{
    console.log("middleWare running");
    next();
});

app.get('/', (req, res)=>{
    res.send('Hello World');
});
app.get('/hell', (req, res)=>{
    res.send('Hello welcome to the hell');
});

app.get('/profile', (req, res, next)=>{
    res.send('guess you are going to hell or heaven?');
    next(new Error("nothing implemented!"));
});

// error handling 
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })

app.listen(3000);