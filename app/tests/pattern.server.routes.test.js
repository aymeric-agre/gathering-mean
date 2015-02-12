'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Pattern = mongoose.model('Pattern'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, pattern;

/**
 * Pattern routes tests
 */
describe('Pattern CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Pattern
		user.save(function() {
			pattern = {
				name: 'Pattern Name'
			};

			done();
		});
	});

	it('should be able to save Pattern instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pattern
				agent.post('/patterns')
					.send(pattern)
					.expect(200)
					.end(function(patternSaveErr, patternSaveRes) {
						// Handle Pattern save error
						if (patternSaveErr) done(patternSaveErr);

						// Get a list of Patterns
						agent.get('/patterns')
							.end(function(patternsGetErr, patternsGetRes) {
								// Handle Pattern save error
								if (patternsGetErr) done(patternsGetErr);

								// Get Patterns list
								var patterns = patternsGetRes.body;

								// Set assertions
								(patterns[0].user._id).should.equal(userId);
								(patterns[0].name).should.match('Pattern Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Pattern instance if not logged in', function(done) {
		agent.post('/patterns')
			.send(pattern)
			.expect(401)
			.end(function(patternSaveErr, patternSaveRes) {
				// Call the assertion callback
				done(patternSaveErr);
			});
	});

	it('should not be able to save Pattern instance if no name is provided', function(done) {
		// Invalidate name field
		pattern.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pattern
				agent.post('/patterns')
					.send(pattern)
					.expect(400)
					.end(function(patternSaveErr, patternSaveRes) {
						// Set message assertion
						(patternSaveRes.body.message).should.match('Please fill Pattern name');
						
						// Handle Pattern save error
						done(patternSaveErr);
					});
			});
	});

	it('should be able to update Pattern instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pattern
				agent.post('/patterns')
					.send(pattern)
					.expect(200)
					.end(function(patternSaveErr, patternSaveRes) {
						// Handle Pattern save error
						if (patternSaveErr) done(patternSaveErr);

						// Update Pattern name
						pattern.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Pattern
						agent.put('/patterns/' + patternSaveRes.body._id)
							.send(pattern)
							.expect(200)
							.end(function(patternUpdateErr, patternUpdateRes) {
								// Handle Pattern update error
								if (patternUpdateErr) done(patternUpdateErr);

								// Set assertions
								(patternUpdateRes.body._id).should.equal(patternSaveRes.body._id);
								(patternUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Patterns if not signed in', function(done) {
		// Create new Pattern model instance
		var patternObj = new Pattern(pattern);

		// Save the Pattern
		patternObj.save(function() {
			// Request Patterns
			request(app).get('/patterns')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Pattern if not signed in', function(done) {
		// Create new Pattern model instance
		var patternObj = new Pattern(pattern);

		// Save the Pattern
		patternObj.save(function() {
			request(app).get('/patterns/' + patternObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', pattern.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Pattern instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pattern
				agent.post('/patterns')
					.send(pattern)
					.expect(200)
					.end(function(patternSaveErr, patternSaveRes) {
						// Handle Pattern save error
						if (patternSaveErr) done(patternSaveErr);

						// Delete existing Pattern
						agent.delete('/patterns/' + patternSaveRes.body._id)
							.send(pattern)
							.expect(200)
							.end(function(patternDeleteErr, patternDeleteRes) {
								// Handle Pattern error error
								if (patternDeleteErr) done(patternDeleteErr);

								// Set assertions
								(patternDeleteRes.body._id).should.equal(patternSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Pattern instance if not signed in', function(done) {
		// Set Pattern user 
		pattern.user = user;

		// Create new Pattern model instance
		var patternObj = new Pattern(pattern);

		// Save the Pattern
		patternObj.save(function() {
			// Try deleting Pattern
			request(app).delete('/patterns/' + patternObj._id)
			.expect(401)
			.end(function(patternDeleteErr, patternDeleteRes) {
				// Set message assertion
				(patternDeleteRes.body.message).should.match('User is not logged in');

				// Handle Pattern error error
				done(patternDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Pattern.remove().exec();
		done();
	});
});