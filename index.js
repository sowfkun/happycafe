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
const cookieEncrypter = require('cookie-encrypter');
const secretKey = process.env.SECRET_KEY;
app.use(cookieParser(secretKey));
app.use(cookieEncrypter(secretKey));



//server with socket.io
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(function(req, res, next) {
    req.io = io;
    next();
  });
//sự kiện kết nối
io.on("connection", ()=>{
    console.log("New connection...")
});

//import router
const homeRouter = require('./routers/home_router')
const drinkRouter = require('./routers/drink_router')
const orderRouter = require('./routers/order_router')
const dashboardRouter = require('./routers/dashboard_router')
const loginRouter = require('./routers/login_router')

//router
app.use('/', homeRouter);
app.use('/drink', drinkRouter);
app.use('/order', orderRouter);
app.use('/dashboard', dashboardRouter);
app.use('/login', loginRouter);

const port = process.env.PORT || 3001;
server.listen(port, ()=>{
    console.log(`Server listening on port ${port}`);
});
module.exports =server;