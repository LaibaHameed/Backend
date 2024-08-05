//* Demo File
const cookieParser = require('cookie-parser');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
app.use(cookieParser());

// cookie set
app.get('/', (req,res)=>{
    res.cookie("name: ", "Laiba");
    res.send("cookie saved!");
});

// cookie read
app.get('/read', (req,res)=>{
    console.log(req.cookies);
    res.send(" read page with open mouth!");
});

// encryption
// Technique 1 (generate a salt and hash on separate function calls):
const saltRounds = 10;
const myPassword = 's0/\/\P4$$w0rD';
let hashStr;
app.get('/password', (req, res)=>{
    bcrypt.genSalt(saltRounds, (err, salt)=>{
        bcrypt.hash(myPassword, salt, (err, hash)=>{
            hashStr = hash;
            res.send(hash);
        })
    })
})

// Technique 2 (auto-gen a salt and hash):
// bcrypt.hash(myPassword, saltRounds, (err, hash) => {
    // Store hash in your password DB.
// });

// decryption: (is mai hm ye check krty hain k hmre password or hash same hai, yahi ye hash isi password se genrate howa hai? agr yes ho ga toh true print ho ga else false)
app.get('/check', (req, res)=>{
    bcrypt.compare(myPassword, hashStr, function(err, result) {
        console.log(result);
        res.send("done");
    });
});

// jwt 
// jwt mai jo lambi c string banti hai wo {email: "laiba@gmail.com"} ye data ho ga , or secret k base py encrypt ho ga, secret pta chal gya toh koi b decryption kr skta hai
app.get('/sign', (req, res)=>{
    let token = jwt.sign({email: "laiba@gmail.com"}, "secret");
    console.log(token);
    res.cookie("token", token);
    res.send("token is on console");

});

app.get('/cookie', (req, res)=>{
    res.send("open this cookie extension and you will see the token in cookie");
    console.log(req.cookies.token);
});

// decryption of jwt
app.get('/verify', (req,res)=>{
    let data = jwt.verify(req.cookies.token, "secret");
    console.log(data);
    res.send(data);
})

app.listen(3000) 