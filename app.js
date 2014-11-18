var express = require("express"),
		app = express(),
		bodyParser = require('body-parser'),
		errorHandler = require('errorhandler'),
		methodOverride = require('method-override'),
		port = parseInt(process.env.PORT, 10) || 8080;

app.use(express.static(__dirname + '/public'));
//app.use(methodOverride());
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({
//	extended: true
//}));

app.use(require('connect-livereload')({
	port: 35729
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function(req, res) {
	res.render('index');
});


app.use(errorHandler({
	dumpExceptions: true,
	showStack: true
}));

console.log("Simple static server listening at http://localhost:" + port);
app.listen(port);