// const express= require('express');
// const app = express();
// const path = require('path');
// const fs = require('fs');

// app.set("view engine","ejs");
// app.use(express.json());
// app.use(express.urlencoded({extended:true}));
// app.use(express.static(path.join(__dirname,"public")));


// app.get('/',function(req,res){
//     fs.readdir(`./files`, function(err, files){
//     res.render("index", {files: files});
//     })

// })

// app.get('/file/:filename',function(req,res){
//     fs.readFile(`./files/${req.params.filename}`,"utf-8", function(err,filedata){
//         res.render('show', {filename: req.params.filename, filedata:filedata });
//     })
// })

// app.get('/edit/:filename',function(req,res){
//     res.render("edit",{ filename: req.params.filename});
// })

// app.post('/edit',function(req,res){
//    fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}`, function(err,){
//     res.redirect('/');
//    })
// })



// app.post('/create',function(req,res){
//     fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, function(err){
//         res.redirect('/');

//     });
// })

// app.listen(3000)

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

// Mock data (replace this with your actual data logic)
let files = ['task1', 'task2'];
let fileDetails = {
    task1: "Details about task 1",
    task2: "Details about task 2"
};
let completedTasks = ['task1']; // Example completed tasks

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('index', { files, completedTasks });
});

app.post('/create', (req, res) => {
    const { title, details } = req.body;
    files.push(title);
    fileDetails[title] = details; // Save the details for the new task
    res.redirect('/');
});

app.get('/file/:filename', (req, res) => {
    const { filename } = req.params;
    const details = fileDetails[filename];
    if (details) {
        res.render('file', { filename, details });
    } else {
        res.status(404).send('File not found');
    }
});

app.get('/edit/:filename', (req, res) => {
    const { filename } = req.params;
    res.render('edit', { filename });
});

app.get('/file/:filename', (req, res) => {
    const { filename } = req.params;
    const details = fileDetails[filename];
    if (details) {
        res.render('file', { filename, details });
    } else {
        res.status(404).send('File not found');
    }
});


app.post('/edit/:filename', (req, res) => {
    const { filename } = req.params;
    const { newFilename } = req.body;
    const fileIndex = files.indexOf(filename);
    if (fileIndex !== -1) {
        files[fileIndex] = newFilename;
        fileDetails[newFilename] = fileDetails[filename];
        delete fileDetails[filename];
    }
    res.redirect('/');
});

app.post('/delete/:filename', (req, res) => {
    const { filename } = req.params;
    files = files.filter(file => file !== filename);
    delete fileDetails[filename];
    completedTasks = completedTasks.filter(task => task !== filename);
    res.redirect('/');
});

app.post('/complete/:filename', (req, res) => {
    const { filename } = req.params;
    if (!completedTasks.includes(filename)) {
        completedTasks.push(filename);
    }
    res.redirect('/');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
