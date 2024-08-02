// common js
// const fs = require('fs');
// ESM

// * file system Module
const fs = require('fs');

// file creation
fs.writeFile("hey.text", "hey yar kesy ho?", (err)=>{
    if (err) console.log(err.message);
    console.log("done")

});

// file mai changes, already file mai add krna
fs.appendFile("hey.text", ", je je allah ka sukar.", (err)=>{
    if (err) console.log(err.message);
    console.log("done")
});

// rename file
fs.rename("hey.text", "hello.txt", (err)=>{
    if (err) console.log(err.message);
    console.log("renamed");
});

// copy file
fs.copyFile("hello.txt", "./copy/copy.txt", (err)=>{
    if (err) console.log(err.message);
    console.log("copied");
});

// unlink file (del file)
fs.unlink("hey.text", (err)=>{
    if (err) console.log(err.message);
    console.log("removed");
})

// mkdir
fs.mkdir("newFolder", (err)=>{
    if (err) console.log(err.message);
    console.log("created");
});

// rmdir (remove directory (folder))
fs.rmdir("newFolder", (err)=>{
    if (err) console.log(err.message);
    console.log("folder removed");
});

fs.rm("copy", {recursive : true} ,(err)=>{
    if (err) console.log(err.message);
    console.log("folder removed");
});

// /create folder
const folderName = 'test';
try {
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
    }
} catch (err) {
    console.error(err);
}

// read a folder
let folderPath = "test";
fs.readdir(folderPath, (err, files) => {
    if (err) console.log(err.message);
    files.forEach(file => {
        console.log(file);
    });
});

//   read a file
fs.readFile("hello.txt", 'utf-8', (err, data) => {
    if (err) console.log(err.message);
    console.log(data);
})



// * HTTP & HTTPS Module
// Hypertext Transfer Protocol (HTTP)

const http = require('http');

let server = http.createServer((req, res)=>{
    res.writeHead(200, {'Content-Type' : 'text/plain'});
    res.end("congrats for creating first ever server");
});

server.listen(8080);
