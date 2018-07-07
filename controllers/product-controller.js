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
            products: response.rows
        });
    });
}


function buildProductDisplayCategory(req, res){
    console.log(req);
    var category = req.body.category;
    console.log(category);
    pool.query('SELECT p.productid, p.productname, p.price, p.numinstock, t.categoryid FROM products p LEFT JOIN tags t ON p.productid=t.productid WHERE t.categoryid=$1', [category], (err, results) => {
        if (err) {
            return;
        } 
        console.log(results);
        res.render('pages/index', {
            products: results.rows
        });
    });

    
//    productModel.getSpecificProducts(category, function(error, response){
//        if(error){
//            return;
//        }
//        console.log(response);
//        res.render('pages/index', {
//            products: response.rows
//        });
//    });
}


module.exports = {
    buildProductDisplay: buildProductDisplay,
    buildProductDisplayCategory:buildProductDisplayCategory
};