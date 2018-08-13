'use strict';

var express = require("express");
var path = require('path');
var compress = require('compression');
var bodyParser = require('body-parser');
var request = require("request");
var mongoose = require('mongoose');
var dotenv = require('dotenv');

//Load Environment Variables
dotenv.load();

//Connect to MongoDB
console.log(process.env.MONGODB);
mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function() {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});

// Define MongoDB Schema
var userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    dob: String,
    contactInfo: {
    	phone: String,
    	email: String,
    	address: {
    		street_address: String,
            city: String,
            state: String,
            zip: String  
    	}
    },
    jainCenter: String,
    dietaryPreferences: String,
    specialNeeds: String
});

//Define mongo model
var User = mongoose.model('User', userSchema);

// Configure express application
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(compress());
app.set('port', (process.env.PORT || 5000));

//User route where the form posts to with the respective information. Saves the user to the mongo table
app.post('/user', function(req, res) {
	//Create new form submission
	console.log(req.body);
	var user = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		dob: req.body.dob,
		contactInfo: {
			phone: req.body.contactInfo.phone,
			email: req.body.contactInfo.email,
			address: {
				street_address: req.body.contactInfo.address.street_address,
				street_address_2: req.body.contactInfo.address.street_address_2,
				state: req.body.contactInfo.address.state,
				zip: req.body.contactInfo.address.zip
			}
		},
		jainCenter: req.body.jainCenter,
		dietaryPreferences: req.body.dietaryPreferences,
		specialNeeds: req.body.specialNeeds
	})
	console.log(user)
	// Save user to database
    user.save(function(err) {
        if (err) throw err;
        return res.send('Succesfully inserted user.');
    });
})

// Main route where the HTML file is served
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

// Port for the application to listen on 
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

