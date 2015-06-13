var express = require('express');
var path = require('path');
var app = express();

//configure app



//add middleware
app.use(express.static(path.join(__dirname, 'bower_components')));
//app.use(bodyParser());




//defining routes
app.get('/', function (req,res){
	  res.render(path.join(__dirname+'/views/home.ejs'));
});

app.get('/matchmake',function(req,res){
  res.sendFile(path.join(__dirname+'/views/Matchmake.html'));
});

app.get('/openjohn',function(req,res){
  res.sendFile(path.join(__dirname+'/views/MatchmakePerson.html'));
});

app.get('/matched',function(req,res){
  res.sendFile(path.join(__dirname+'/views/MatchmakeSuccess.html'));
});


app.listen(1337,function(){
	console.log('ready on port 1337');
});