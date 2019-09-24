var express = require('express'),
	app = express(),
	port = process.env.PORT || 1337,
	mongoose = require('mongoose'),
	Task = require('./api/models/todoListModel'), //created model loading here
	bodyParser = require('body-parser');

//mongoose instance connection url connection
mongoose.set('useUnifiedTopology', true);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Tododb', { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/todoListRoutes'); //importing route
routes(app); //register the route

// Order matters for this function.  If it is placed any earlier in the code, it will break
app.use(function(req, res) {
	res.status(404).send({url: req.originalUrl + ' not found'});
});

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);