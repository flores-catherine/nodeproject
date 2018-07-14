var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

const productModel = require("../model/products-model.js");

//Get db URL from process environment variable
const dbURL = process.env.DATABASE_URL;

const { Pool } = require('pg')
const pool = new Pool({
    connectionString: dbURL,
    ssl: true
});


function buildProductDisplay(req, res){
    productModel.getAllProducts(function(error, response){
        if(error){
            return;
        }
        res.render('pages/index', {
            products: response.rows,
            is_loggedin: req.session.is_loggedin || false
        });
    });
}


function buildProductDisplayCategory(req, res){
    //console.log(req.query);
    var cat = req.query.category;
    console.log(cat);
    pool.query('SELECT p.productid, p.productname, p.price, p.numinstock, p.image, t.categoryid FROM products p LEFT JOIN tags t ON p.productid=t.productid WHERE t.categoryid=$1', [cat], (err, results) => {
        if (err) {
            return;
        } 
        //console.log(results);
        res.render('pages/index', {
            products: results.rows,
            is_loggedin: req.session.is_loggedin || false
        });
    });
}

function addProductToCart(req,res){
    //console.log(req.query.numinstock);
    var item = {
        prodID: req.query.prodid,
        img:req.query.image,
        name:req.query.product,
        price: req.query.price,       
        quantity: req.query.numinstock       
    };
    var usercart = req.session.cart;
    //console.log(item);
    usercart.push(item);
//    console.log(usercart);
    res.redirect('/');
}

function removeProduct(req,res){
    var usercart = req.session.cart;
    for (var i=0; i<usercart.length; i++){
//        if(usercart[i].prodID==id){
//            usercart.splice(i,1);
//            break;
//        }
    }
    console.log(usercart);
    res.redirect('/render-cart');
}

function completeTransaction(req,res){
    cart_items = req.session.cart
    //console.log(cart_items);
    cart_items.forEach(function(cart_item){
        var orderNum = req.body.productQuantity;
        console.log(orderNum);
        console.log(cart_item.quantity);
        var newQuant = cart_item.quantity - orderNum;
        console.log(newQuant);
        var productID = cart_item.prodID;
        pool.query('UPDATE products SET numinstock = $1 WHERE productid = $2', [newQuant, productID], (err, results) => {
        if (err) {
            console.log("I like sandwiches");
        } else{
            console.log(results);
            req.session.cart = [];
            res.render('pages/success', {
                is_loggedin: req.session.is_loggedin || false
            });
        };
    });
    });
};

module.exports = {
    buildProductDisplay: buildProductDisplay,
    buildProductDisplayCategory:buildProductDisplayCategory,
    addProductToCart:addProductToCart,
    removeProduct:removeProduct,
    completeTransaction:completeTransaction
};