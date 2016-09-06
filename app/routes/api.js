// Call the packages
var User        = require('../models/user');
var jwt         = require('jsonwebtoken');
var config      = require('../../config');
var mongoDB     = require('mongodb');
var ObjectId    = mongoDB.ObjectID;

// Super Sceret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

	// Get an instance of the express router
	var apiRouter = express.Router();

	// Route to authenticate a users (POST http://localhost:1337/api/authenticate)
	apiRouter.post('/authenticate', function(req, res) {
		console.log(req.body.username);
		// Find the user
		// Select the name username and password explicitly
		User.findOne({ username: req.body.username })
		.select('name username password')
		.exec(function(err, user) {
			if (err) {
				throw err;
			}
			// No user with that username was found
			if (!user) {
				res.json({
					success: false,
					message: 'Authentication failed. User not found.'
				});
			} else if (user) {
				// Check if password matches
				var validPassword = user.comparePassword(req.body.password);
				if (!validPassword) {
					res.json({
						success: false,
						message: 'Authentication failed. Wrong password.'
					});
				} else {
					// If user is found and password is right then create a token
					var token = jwt.sign(user, superSecret, {
						expireInMinutes: 1440 // Expire in 24 hpurs
					});
					// Return the information including token as JSON
					res.json({
						success: true,
						message: 'Enjoy your token',
						token: token
					});
				}
			}
		});
	});

	// Middleware to verify a token
	apiRouter.use(function(req, res, next) {
		console.log('Somebody just came to our api!');	

		// Route middleware to verify a token
		// Check header or url parameters or post parameters for token
		var token = req.body.token || req.param('token') || req.headers['x-access-token'];

		// Decode token
		if (token) {
			// Verify secret and checks exp
			jwt.verify(token, superSecret, function(err, decoded) {
				if (err) {
					return res.status(403).send({
						success: false,
						message: 'Failed to authenticate token.'
					});
				} else {
					// If everything is good, save to request for use in other routes
					req.decoded = decoded;
					// Make sure we go to the next routes and don't stop here
					next();
				}
			});
		} else {
			// If thete is no token, return an HTTP response of 403 (access forbidden) and an error message
			return res.status(403).send({
				success: false,
				message: 'No token provided.'
			});
		}	
	});
	// Test route to make sure everything is working
	// Accessed at GET http://localhost:1337/api
	apiRouter.get('/', function(req, res) {
		res.json({ message: 'Hooray!! Welcome to out API!!' });
	});

	// On routes that end in /users
	apiRouter.route('/users')
		// Create a user (accessed at POST http://localhost:1337/api/users)
		.post(function(req, res) {
			// Create a new instance of the User model
			var user = new User();

			// Set the users information (comes from the request)
			user.name = req.body.name;
			user.username = req.body.username;
			user.password = req.body.password;

			// Save the user and check for errors
			user.save(function(err) {
				if (err) {
					// Duplicate entry
					if (err.code == 11000) {
						return res.json({ success: false, message: 'A user with same username already exists.' });
					}
					else {
						return res.send(err);
					}
				}
				res.json({ message: 'User created!' });
			});		
		})
		// Get all the users (accessed at GET http://localhost:1337/api/users)
		.get(function(req, res) {
			User.find(function(err, users) {
				if (err) {
					res.send(err);
				}
				res.json(users);
			});
		});

	// On routes that end in /users/:user_id
	apiRouter.route('/users/:user_id')
		// Get the user with that id (accessed at GET http://localhost:1337/api/users/:user_id)
		.get(function(req, res) {
			console.log(req);		
			User.findOne({ "_id": ObjectId(req.params.user_id) }, function(err, user) {
				if (err) {
					res.send(err);
				}
				res.json(user);
			});
		})
		// Update the user with this id (accessed at PUT http://localhost:1337/api/users/:user_id)
		.put(function(req, res) {
			// Use our user model to find the user we want
			User.findOne({ "_id": ObjectId(req.params.user_id) }, function(err, user) {
				if (err) {
					res.send(err);
				}
				// Update the users info only if its new
				if (req.body.name) {
					user.name = req.body.name;
				}
				if (req.body.username) {
					user.username = req.body.username;
				}
				if (req.body.password) {
					user.password = req.body.password;
				}

				// Save the user
				user.save(function(err) {
					if (err) {
						res.send(err);
					}

					// Return a message
					res.json({ message: 'User updated!!' });
				});
			});
		})
		// Delete the user with this id (accessed at DELETE http://localhost:1337/api/users/:user_id)
		.delete(function(req, res) {
			User.remove({ "_id": ObjectId(req.params.user_id) }, function(err, user) {
				if (err) {
					res.send(err);
				}
				res.json({ message: 'Successfully deleted!!' });
			});
		});

		// API endpoint to get user information
		apiRouter.get('/me', function(req, res) {
			res.send(req.decoded);
		});
		
		
	return apiRouter;
};