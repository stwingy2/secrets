//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/secretDB', {
	useNewUrlParser: true,
	useFindAndModify: false,
	useCreateIndex: true,
	useUnifiedTopology: true
});
const userSchema = {
	email: String,
	password: String
};
const User = mongoose.model('user', userSchema);

app.get('/', (req, res) => {
	res.render('home');
});
app.get('/login', (req, res) => {
	res.render('login');
});
app.get('/register', (req, res) => {
	res.render('register');
});

app.post('/register', async (req, res) => {
	try {
		const newUser = await User.create({ email: req.body.username, password: req.body.password });
		if (newUser) {
			res.render('secrets');
		}
	} catch (e) {
		console.error(e);
		res.status(400).end();
	}
});
app.post('/login', async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.username });
		console.log(user);
		if (user) {
			if (user.password === req.body.password) {
				res.render('secrets');
			}
		}
	} catch (e) {
		console.error(e);
		res.status(400).end();
	}
});

app.listen(3000, () => {
	console.log('app listening');
});
