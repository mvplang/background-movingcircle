var express = require('express');
var app = express();
var path = require('path');

app.set('view engine', 'pug');
app.set('views','./views');

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.render('index');
});

app.listen(8080);
console.log('server running at 8080')