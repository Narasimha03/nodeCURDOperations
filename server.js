var school = require("./api_components/school.js");
const express=require('express');
const mongoClient=require('mongodb').mongoClient;
const bodyParser=require('body-parser');
const app=express();
const port =8000;
var config = require("./config.json");
const server =require('http').createServer(app);
const router=express.Router();
var url = 'mongodb://' + config.dbhost + ':27017/narasimha';
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: false, parameterLimit: 10000 }));


app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

router.use(function (req, res, next) {
    // do logging
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST , GET , OPTIONS , DELETE , EDIT, PUT");
    next(); // make sure we go to the next routes and don't stop here
});

app.use(function (req, res, next) {
    // do logging
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST , GET , OPTIONS , DELETE , EDIT, PUT");
    next(); // make sure we go to the next routes and don't stop here
});

app.get('/', function (req, res) {
    res.send('School ERP API');
});



app.listen(port, function(){
console.log("Server Starting on :"+port);
});
app.use('/api', school);