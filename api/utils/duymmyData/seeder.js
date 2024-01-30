const fs = require('fs');


// eslint-disable-next-line import/no-extraneous-dependencies
require('colors');

const dotenv = require('dotenv');
const Product = require('../../models/productModel');
const dbConnection = require('../../config/db_connection');

dotenv.config({ path: '../../../config.env' });
// connect to DB
dbConnection();


// Read data
const products = JSON.parse(fs.readFileSync('./products.json'));


// Insert data into DB
const insertData = async () => {
  try {
    await Product.create(products);

    console.log('Data Inserted'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log('Data Destroyed'.red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

//  node      seeder.js               -d
//? [0] =node    [1]=seeder.js        [2]= -d
if (process.argv[2] === '-i') {
  insertData();
} else if (process.argv[2] === '-d') {
  destroyData();
}
