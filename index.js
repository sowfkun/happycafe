var express = require("express");
var app = express();
require('dotenv').config();

//import mongoose
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOOSE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// body parser
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//static assets
app.use(express.static("public"));

//view template ejs
app.set('view engine', 'ejs');
app.set('views', './views');
// cookies parser
var cookieParser = require('cookie-parser');
app.use(cookieParser());


//import router
const homeRouter = require('./routers/home_router')
const drinkRouter = require('./routers/drink_router')
const queue_orderRouter = require('./routers/queue_order_router')
const dashboardRouter = require('./routers/dashboard_router')
const loginRouter = require('./routers/login_router')
//router
app.use('/', homeRouter);
app.use('/drink', drinkRouter);
app.use('/queue_order', queue_orderRouter);
app.use('/dashboard', dashboardRouter);
app.use('/login', loginRouter);

//server
const port = process.env.PORT || 3001;
var server = app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

module.exports = server;