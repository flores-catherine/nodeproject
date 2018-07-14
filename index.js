var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var http = require('http');
var session = require('express-session');

const userModel = require("./model/user-model.js");
var productcontroller = require("./controllers/product-controller.js");
var urlEncodedParser = bodyParser.urlencoded({ extended: false});
const productModel = require("./model/products-model.js");

var app = express();
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'barbacoa',
  resave: false,
  saveUninitialized: true,
}))

//view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//middleware that goes with parsing stuff.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


//middleware for static files -- set static path
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  if (!req.session.cart) {
    req.session.cart = [];
  }

  next();
});

app.get('/', productcontroller.buildProductDisplay);

app.get('/render-login', function(req,res){
    res.render('pages/login', {
        is_loggedin: req.session.is_loggedin || false
    });
});

app.get('/render-register', function(req,res){
    res.render('pages/registration' , {
        is_loggedin: req.session.is_loggedin || false
    });
});

app.get('/render-cart', function(req,res){
    res.render('pages/cart', {
            is_loggedin: req.session.is_loggedin || false,
            cart_items: req.session.cart
    });
});

app.post('/handleRegistration', userModel.handleRegistration);

app.post('/handleLoginRequest', userModel.handleLogin);

app.get('/filterProducts', productcontroller.buildProductDisplayCategory);

app.get('/addToCart', productcontroller.addProductToCart);

app.get('/removeItem', productcontroller.removeProduct);


app.post('/completePurchase', productcontroller.completeTransaction);


app.get('/logout', function(req,res){
    req.session.is_loggedin = false;
    res.redirect('/');
})

app.listen(process.env.PORT || 3000, () => console.log('Listening on port 3000!'));