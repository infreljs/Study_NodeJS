const fs = require('fs');
const bodyParser = require('body-parser');
const multer = require('multer');
const storage = multer.diskStorage({
   destination: function(req, file, cb) {
       cb(null, 'uploads/')
   },
   filename: function(req, file, cb) {
       cb(null, file.originalname)
   }
});
const upload = multer({storage: storage});
const express = require('express');
const app = express();

app.set('views', './views_file');
app.set('view engine', 'jade');
app.use('/user', express.static('uploads/'));
app.use(bodyParser.urlencoded({extended:false}));
app.locals.pretty = true;

app.get('/topic/new', function(req, res) {
    fs.readdir('data', function(err, files) {
        if(err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        res.render('new', {topics:files});
    });
});
app.get(['/topic', '/topic/:id'], function(req, res) {
    fs.readdir('data', function(err, files) {
        if(err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        var id = req.params.id;
        if(id) {
            fs.readFile('data/' + id, 'utf8', function(err, data) {
              if(err) {
                  res.status(500).send('Internal Server Error');
              }
              res.render('view', {title:id, description:data, topics:files});
            });
        } else {
            res.render('view', {topics:files, title:"Welcome", description:"Hello, Server Side Javascript"
            });
        }
    });
});
app.get('/upload', function(req, res) {
   res.render('upload'); 
});

app.post('/topic', function(req, res) {
    var title = req.body.title;
    var description = req.body.description;
    fs.writeFile('data/' + title, description, function(err) {
        if(err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        res.redirect('/topic/' + title);
    });
});
app.post('/upload', upload.single('userfile'), function(req, res) {
    res.send(req.file.filename);
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log('Connected at ' + process.env.IP + ':' + process.env.PORT)
});