require('dotenv').config();

var express = require("express");
const cookieParser = require("cookie-parser");
const CsvParser = require("json2csv").Parser;
const multer = require("multer");
const csv = require('csv-parser');
const fs = require('fs');
const cors = require('cors');
const cjs = require("crypto-js");
const mongoose =require("mongoose");
var path = require("path");

//TODO:import inital configuration and connection checks
require("./config/dbconn");
//TODO:port defination
const port = process.env.PORT || 80;

//TODO:import local modules and middlewares
const auth = require("./middleware/auth");
const rc = require('./controllers/responseController');

//TODO:setup app
var app = express();

//TODO: app extentions
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//TODO: import Routers
const indexRouter = require("./routes/index");
const userInformation = require("./routes/r_user_info");
const Category = require("./routes/r_category");
const SubCategory = require("./routes/r_subcategory");
const Product = require("./routes/r_product");

//TODO:Applying Routes As A Middleware
app.use("/", indexRouter);
app.use("/api/User", userInformation);
app.use("/api/Category", Category);
app.use("/api/SubCategory", SubCategory);
app.use("/api/Product", Product);


//TODO:catch 404 and forward to error handler
app.use(function (req, res, next) {
   // next(createError(404));
   return rc.setResponse(res, {
    msg: "API not Found:404"
})
  });


app.listen(port, () => { console.log(`connection is setup at ${port}`); })
