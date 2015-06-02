var express = require("express");
var app     = express();
var path    = require("path");

//Store all JS and CSS in Scripts folder.
app.use("/css", express.static(__dirname + '/css'));
app.use("/js", express.static(__dirname + '/js'));


// Render index.html
app.get('/',function(req,res){
  res.sendFile(__dirname + '/index.html');
  //__dirname : It will resolve to your project folder.
});

// Render chart.html
app.get('/charts.html',function(req,res){
  res.sendFile(__dirname + '/charts.html');
  //__dirname : It will resolve to your project folder.
});

var port = Number(process.env.PORT || 3000)
app.listen(port);

console.log("Running at Port 3000");