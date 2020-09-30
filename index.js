var express = require("express");
var app = express();
require('dotenv').config();

//import router
const homeRouter= require('./routers/home_router')



// body parser
const bodyParser =require('body-parser')    
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//view template ejs
app.use(express.static("public"));

app.set('view engine', 'ejs');
app.set('views', './views');


app.use('', homeRouter);


const port = process.env.PORT || 3001;

var server = app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

module.exports = server;