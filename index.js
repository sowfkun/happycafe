var express = require("express");
var app = express();


// body parser
const bodyParser =require('body-parser')    
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//view template ejs
app.use(express.static("public"));

app.set('view engine', 'ejs');
app.set('views', './views');


app.use("", (req,res) => {
    res.send("Web app Front end")
});


const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});