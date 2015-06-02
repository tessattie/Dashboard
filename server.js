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

app.listen(3000);

console.log("Running at Port 3000");