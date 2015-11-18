var express = require('express');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/yt-test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
	console.log('db connection succeeded.');
// 	var kittySchema = mongoose.Schema({
// 		name: String
// 	});	
// 	var Kitten = mongoose.model('Kitten', kittySchema);
// 	var silence = new Kitten({name: 'Silence'});
// 	console.log(silence.name);
});

var Note = require('./models/note');

var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();

var port = process.env.PORT || 8080; //set our port


router.get('/', function(req, res) {
	// res.send('hello world');
	res.json({message: 'yay '})
});

router.route('/notes')
	// post http://localhost:8080/api/notes
	.post(function(req, res) {
		var note = new Note(); //create new instance of note model
		note.name = req.body.name; //set the note name from request
		console.log(req.body.name);
		//save the note and check for errors
		note.save(function(err){
			if(err) {
				res.send(err);
			}
			res.json({message: 'Note Created!'});
		});
	})

	// get all notes http://localhost:8080/api/notes
	.get(function(req, res) {
		Note.find(function(err, notes){
			if(err){
				res.send(err);
			}
			res.json(notes);
		});
	});

router.route('/notes/:id')
	// get the note with id http://localhost:8080/api/notes/:id
	.get(function(req, res) {
		Note.findById(req.params.id, function(err, note){
			if(err){
				res.send(err);
			}
			res.json(note);
		});
	})

	// put update the note with this id http://localhost:8080/api/notes/:id
	.put(function(req, res){
		Note.findById(req.params.id, function(err, note){
			if (err) {
				res.send(err);
			}
			note.name = req.body.name; // update note info
			note.save(function(err){
				if (err) {
					res.send(err);
				}
				res.json({message: 'Note updated!'});
			});
		});
	})

	// delete the note with id http://localhost:8080/api/notes/id
	.delete(function(req, res){
		Note.remove({
			_id: req.params.id
		}, function(err, note){
			if (err) {
				res.send(err);
			}
			res.json({message: 'Successfully deleted'})
		});
	});



//register routes all prefixed with api
app.use('/api', router);

app.listen(port);
console.log("tune in to port " + port);
