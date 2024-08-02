const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '/public')));
app.set("view engine", "ejs");

app.get('/', (req, res) => {
    fs.readdir(`./files`, (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        res.render("index", { files: files });
    })
})

app.get('/file/:filename', (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, 'utf-8', (err, fileData) => {
        res.render('show', { fileName: req.params.filename, fileData: fileData });
    })
})
app.get('/edit/:filename', (req, res) => {
    const filepath = path.join(__dirname, 'files', req.params.filename);

    fs.readFile(filepath, 'utf-8', (err, fileData) => {
        if (err) {
            console.log(err.message)
            return res.status(500).send('internal server error')
        }
        res.render('edit', { fileName: req.params.filename, fileData: fileData });
    })
})


app.post('/edit/:filename', (req, res) => {
    const oldFilePath = path.join(__dirname, 'files' , req.params.filename);
    const newFileName = req.body.new.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('') + '.txt';
    const newFilePath = path.join(__dirname, 'files', newFileName);
    const fileContent = req.body.details;
    // First, update the file content

    fs.writeFile(oldFilePath, fileContent, 'utf-8', (err)=>{
        if (err) {
            console.log(err.message)
            return res.status(500).send('internal server error')
        }
        // then if the file content changes rename the file 
        if(oldFilePath != newFilePath){
            fs.rename(oldFilePath, newFilePath, (err)=>{
                if (err) {
                    console.log(err.message)
                    return res.status(500).send('internal server error')
                }
                res.redirect('/')
            })
        }else {
            res.redirect('/');
        }
    })
})

app.get('/delete/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'files', req.params.filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect('/');
    });
});








// app.post('/create', (req, res)=>{
//     fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt` , req.body.details, (err)=>{
//         res.redirect('/');
//     })
// })

app.post('/create', (req, res) => {
    const fileName = req.body.title.split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join('') + '.txt';
    const filePath = path.join(__dirname, 'files', fileName);

    fs.writeFile(filePath, req.body.details, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect('/');
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})