var express = require("express");
var app = express();
url = require('url');

//Use static folders with node.js
app.use("/bootstrap", express.static(__dirname + '/bootstrap'));
app.use("/build", express.static(__dirname + '/build'));
app.use("/dist", express.static(__dirname + '/dist'));
app.use("/font", express.static(__dirname + '/font'));
app.use("/documentation", express.static(__dirname + '/documentation'));
app.use("/pages", express.static(__dirname + '/pages'));
app.use("/plugins", express.static(__dirname + '/plugins'));

// Render all HTML pages
app.get('/',function(req,res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/index.html',function(req,res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/pages/calendar.html',function(req,res){
  res.sendFile(__dirname + '/pages/calendar.html');
});

app.get('/documentation/index.html',function(req,res){
  res.sendFile(__dirname + '/documentation/index.html');
});
// End of rendering HTML pages


// Setup of PORT value fot application to work with heroku
var port = Number(process.env.PORT || 3000);
app.listen(port);
console.log("Running at Port 3000");