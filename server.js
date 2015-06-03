var express = require("express");
var app = express();
url = require('url');

//Use static folders with node.js
app.use("/css", express.static(__dirname + '/css'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/img", express.static(__dirname + '/img'));
app.use("/font", express.static(__dirname + '/font'));


// Render all HTML pages
app.get('/',function(req,res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/index.html',function(req,res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/reports.html',function(req,res){
  res.sendFile(__dirname + '/reports.html');
});

app.get('/guidely.html',function(req,res){
  res.sendFile(__dirname + '/guidely.html');
});

app.get('/charts.html',function(req,res){
  res.sendFile(__dirname + '/charts.html');
});

app.get('/shortcodes.html',function(req,res){
  res.sendFile(__dirname + '/shortcodes.html');
});

app.get('/icons.html',function(req,res){
  res.sendFile(__dirname + '/icons.html');
});

app.get('/faq.html',function(req,res){
  res.sendFile(__dirname + '/faq.html');
});

app.get('/pricing.html',function(req,res){
  res.sendFile(__dirname + '/pricing.html');
});

app.get('/login.html',function(req,res){
  res.sendFile(__dirname + '/login.html');
});

app.get('/signup.html',function(req,res){
  res.sendFile(__dirname + '/signup.html');
});

app.get('/error.html',function(req,res){
  res.sendFile(__dirname + '/error.html');
});
// End of rendering HTML pages


// Setup of PORT value fot application to work with heroku
var port = Number(process.env.PORT || 3000);
app.listen(port);
console.log("Running at Port 3000");