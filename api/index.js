var express = require('express');
var app = express();
var router = express.Router();

var port = process.env.PORT || 8080; //set our port

router.get('/', function(req, res) {
	res.send('hello world');
});

app.use('/api', router); //register routes all prefixed with api

app.listen(port);
console.log("tune in to port " + port);
