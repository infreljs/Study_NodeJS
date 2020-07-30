const express = require("express");
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

app.locals.pretty = true;
app.set('view engine', 'jade');
app.set('views', './views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.send('<h1>Hello Home Page</h1><img src="yourname.jpg">');
});
app.get('/login', (req, res) => {
    res.send('Login Please');
});
app.get('/dynamic', (req, res) => {
    var output = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Dynamic Page</title>
        </head>
        <body>
            Hello Dynamic!
        </body>
    </html>`;
    res.send(output);
});
app.get('/template', function(req, res) {
   res.render('temp', {time:Date(), title:'Jade'}); 
});
app.get('/form', function(req, res) {
   res.render('form'); 
});
app.get('/form_receive', function(req, res) {
   var title = req.query.title;
   var description = req.query.description;
   res.send(title+', '+description);
});

app.post('/form_receive', function(req, res) {
   var title = req.body.title;
   var description = req.body.description;
   res.send(title+', '+description);
});

app.listen(process.env.PORT, process.env.IP, () => {
    console.log('Connected ' + process.env.IP + ':' + process.env.PORT);
});