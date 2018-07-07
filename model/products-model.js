//Get db URL from process environment variable
const dbURL = process.env.DATABASE_URL;

const { Pool } = require('pg')
const pool = new Pool({
    connectionString: dbURL,
    ssl: true
});

function getAllProducts(callback){
    return pool.query('SELECT * FROM products', callback);
}


function getSpecificProducts(category, callback){
    return pool.query('SELECT p.productid, p.productname, p.price, p.numinstock, t.categoryid FROM products p LEFT JOIN tags t ON p.productid=t.productid WHERE t.categoryid=$1', [category], callback);
}

module.exports = {
    getAllProducts: getAllProducts,
    getSpecificProducts: getSpecificProducts
};