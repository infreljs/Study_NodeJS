var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var expressErrorHandler = require('express-error-handler');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var multer = require('multer');
var fs = require('fs');
var cors = require('cors');
var MongoClient = require('mongodb').MongoClient;

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cookieParser());
app.use(session({
    secret: 'DSMWARGAMESESS10NKEY',
    resave: false,
    saveUninitialized: true
}));
app.use(cors());

// MongoDB
var database;

function connectDB() {
    var databaseURL = 'mongodb://localhost:27017/dsm_wargame';
    MongoClient.connect(databaseURL, function (err, db) {
        if (err) throw err;
        console.log('Connected to MongoDB : ' + databaseURL);
        database = db;
    });
}

// multer
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname + Date.now());
    }
});

var upload = multer({
    storage: storage,
    limits: {
        files: 10,
        fileSize: 1024 * 1024 * 1024
    }
})

// Routing
// Default Routing
app.get('/', function (req, res) {
    if (req.session.user_id) {
        res.send('<h1>Hello, ' + req.session.user_id + '</h1><br><a href="/logout">Logout</a>');
    } else {
        res.send('<h1><a href="/login">Please Login</a></h1>');
    }
});

// Session
app.get('/count', function (req, res) {
    if (req.query.mode == "reset") {
        req.session.count = 0;
        res.redirect('/count');
    }
    if (!req.session.count) {
        req.session.count = 0;
    }
    res.send('Count : ' + req.session.count++);
});

app.get('/login', function (req, res) {
    fs.readFile('public/login.html', function (err, data) {
        res.write(data);
        res.end();
    });
});

app.get('/logout', function (req, res) {
    delete req.session.user_id;
    res.redirect('/');
});

// Token Routing
app.get('/:id', function (req, res) {
    res.send('<h1>Hi ' + req.params.id + '</h1>');
});

// File Upload Routing
app.post('/process/photo', upload.array('photo', 5), function (req, res) {
    try {
        var files = req.files;
        console.dir(files);
        res.send();
    } catch (err) {
        colsole.dir(err.stack);
    }
});

// Login
app.post('/process/login', function (req, res) {
    if (database) {
        var user = database.collection('user');
        user.find({
            "id": req.body.id,
            "pw": req.body.pw
        }).toArray(function (err, docs) {
            if (err) {
                throw err;
            }
            if (docs.length > 0) {
                console.log('[' + req.body.id + ', ' + req.body.pw + '] Logined');
                req.session.user_id = req.body.id;
                req.session.save();
                res.redirect('/');
            }
        });
    }
});

// Error Handler
var errorHandler = expressErrorHandler({
    static: {
        '404': 'error/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);
// /Error Handler

app.listen(3000, function () {
    console.log('Connected at Port 3000!');
    connectDB();
});