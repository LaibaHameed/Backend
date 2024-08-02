const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '/public')));
app.set("view engine", "ejs");

//? Home Page

app.get('/', (req, res) => {
    fs.readdir(`./files`, (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        res.render("index", { files: files });
    })
})

// jaha py err parameter k tor py pas howa hai waha waha hm ye likh skty hain
// if (err) {
//     console.log(err.message)
//     return res.status(500).send('internal server error')
// }


//? create a Task/file
//* create path py jao
// jo title ho ga , hm osi name se filname save karin gy, ab name ko achy se save krny k liye (like HelloWorld.txt format)
// 1. title ko space k bases py plit kairin gy
// 2. phir har word k first letter(0 index) ko capital or rest(1...n index, 1st letter ka slice nikal kr baqi ko lowerCase) ko small case mai karin gy  (map, toUpperCase, slice, toLowerCase)
// 3. or is mapped array ko join kr dain gy begyr space k or .txt ko b sath jor dain gy
//* phir hm path banaye gy 
// 1. phly __dirname(base folder) mai jain gy or 'files' mai jain gy or fileName,
//* phir hm file ko write/create karin gy, file path de gy(osi mai file ka name ho ga) or file mai kya rkhna hai wo pass karin gy. jb ye kam ho jye ga toh hm home page py redirect kr jain gy.

app.post('/create', (req, res) => {
    const fileName = req.body.title.split(' ').map(word => { word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() }).join('') + '.txt';
    const filePath = path.join(__dirname, 'files', fileName);

    fs.writeFile(filePath, req.body.details, (err) => {
        res.redirect('/');
    });
});

//? when we trigger read more 
// (/file) route py /: file ka name jur jaye ga
// phir file ko read karin gy,
// file ka path dain gy
// utf-8 means origanal format mai read karin gy,
// or call back function mai file ka data pass karin gy
// phir show page py hm fileName or fileData send karin gy or waha se phir get kr k display kara dain gy 
app.get('/file/:filename', (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, 'utf-8', (err, fileData) => {
        res.render('show', { fileName: req.params.filename, fileData: fileData });
    })
});

//? edit task/file
// (/edit) route py /: file ka name jur jaye ga
// phir file ko read karin gy, or edit page render kr dain gy
app.get('/edit/:filename', (req, res) => {
    const filepath = path.join(__dirname, 'files', req.params.filename);

    fs.readFile(filepath, 'utf-8', (err, fileData) => {
        res.render('edit', { fileName: req.params.filename, fileData: fileData });
    })
})
//* edit ka button jb trigger ho ga (form submission)
// file ko write/create/edit karin gy
// old file name mai hi file ka content update karin gy 
// then if the file name changes rename the file 
// or page py redirect kara dain gy
app.post('/edit/:filename', (req, res) => {
    const oldFilePath = path.join(__dirname, 'files', req.params.filename);
    const newName = req.body.new.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('') + '.txt';
    const newFilePath = path.join(__dirname, 'files', newName);
    const fileContent = req.body.details;
    // First, update the file content
    fs.writeFile(oldFilePath, fileContent, 'utf-8', (err) => {
        // then if the file name changes rename the file 
        if (oldFilePath != newFilePath) {
            fs.rename(oldFilePath, newFilePath, (err) => {
                res.redirect('/')
            })
        } else {
            res.redirect('/');
        }
    })
})

//?  delete task/file
app.get('/delete/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'files', req.params.filename);
    fs.unlink(filePath, (err) => {
        res.redirect('/');
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})