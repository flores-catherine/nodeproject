var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

const userModel = require("./model/user-model.js")
var urlEncodedParser = bodyParser.urlencoded({ extended: false});

var app = express();


//view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//middleware that goes with parsing stuff.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//middleware for static files -- set static path
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res){
    res.render('pages/index');
});

app.get('/render-login', function(req,res){
    res.render('pages/login');
});

app.get('/render-register', function(req,res){
    res.render('pages/registration');
});

app.get('/render-cart', function(req,res){
    res.render('pages/cart');
});

app.post('/handleRegistration', userModel.handleRegistration);

app.post('/handleLoginRequest', userModel.handleLogin);

app.listen(process.env.PORT || 3000, () => console.log('Listening on port 3000!'));