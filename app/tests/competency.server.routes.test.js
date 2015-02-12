'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Competency = mongoose.model('Competency'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, competency;

/**
 * Competency routes tests
 */
describe('Competency CRUD tests', function() {
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

		// Save a user to the test db and create new Competency
		user.save(function() {
			competency = {
				name: 'Competency Name'
			};

			done();
		});
	});

	it('should be able to save Competency instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Competency
				agent.post('/competencies')
					.send(competency)
					.expect(200)
					.end(function(competencySaveErr, competencySaveRes) {
						// Handle Competency save error
						if (competencySaveErr) done(competencySaveErr);

						// Get a list of Competencies
						agent.get('/competencies')
							.end(function(competenciesGetErr, competenciesGetRes) {
								// Handle Competency save error
								if (competenciesGetErr) done(competenciesGetErr);

								// Get Competencies list
								var competencies = competenciesGetRes.body;

								// Set assertions
								(competencies[0].user._id).should.equal(userId);
								(competencies[0].name).should.match('Competency Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Competency instance if not logged in', function(done) {
		agent.post('/competencies')
			.send(competency)
			.expect(401)
			.end(function(competencySaveErr, competencySaveRes) {
				// Call the assertion callback
				done(competencySaveErr);
			});
	});

	it('should not be able to save Competency instance if no name is provided', function(done) {
		// Invalidate name field
		competency.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Competency
				agent.post('/competencies')
					.send(competency)
					.expect(400)
					.end(function(competencySaveErr, competencySaveRes) {
						// Set message assertion
						(competencySaveRes.body.message).should.match('Please fill Competency name');
						
						// Handle Competency save error
						done(competencySaveErr);
					});
			});
	});

	it('should be able to update Competency instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Competency
				agent.post('/competencies')
					.send(competency)
					.expect(200)
					.end(function(competencySaveErr, competencySaveRes) {
						// Handle Competency save error
						if (competencySaveErr) done(competencySaveErr);

						// Update Competency name
						competency.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Competency
						agent.put('/competencies/' + competencySaveRes.body._id)
							.send(competency)
							.expect(200)
							.end(function(competencyUpdateErr, competencyUpdateRes) {
								// Handle Competency update error
								if (competencyUpdateErr) done(competencyUpdateErr);

								// Set assertions
								(competencyUpdateRes.body._id).should.equal(competencySaveRes.body._id);
								(competencyUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Competencies if not signed in', function(done) {
		// Create new Competency model instance
		var competencyObj = new Competency(competency);

		// Save the Competency
		competencyObj.save(function() {
			// Request Competencies
			request(app).get('/competencies')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Competency if not signed in', function(done) {
		// Create new Competency model instance
		var competencyObj = new Competency(competency);

		// Save the Competency
		competencyObj.save(function() {
			request(app).get('/competencies/' + competencyObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', competency.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Competency instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Competency
				agent.post('/competencies')
					.send(competency)
					.expect(200)
					.end(function(competencySaveErr, competencySaveRes) {
						// Handle Competency save error
						if (competencySaveErr) done(competencySaveErr);

						// Delete existing Competency
						agent.delete('/competencies/' + competencySaveRes.body._id)
							.send(competency)
							.expect(200)
							.end(function(competencyDeleteErr, competencyDeleteRes) {
								// Handle Competency error error
								if (competencyDeleteErr) done(competencyDeleteErr);

								// Set assertions
								(competencyDeleteRes.body._id).should.equal(competencySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Competency instance if not signed in', function(done) {
		// Set Competency user 
		competency.user = user;

		// Create new Competency model instance
		var competencyObj = new Competency(competency);

		// Save the Competency
		competencyObj.save(function() {
			// Try deleting Competency
			request(app).delete('/competencies/' + competencyObj._id)
			.expect(401)
			.end(function(competencyDeleteErr, competencyDeleteRes) {
				// Set message assertion
				(competencyDeleteRes.body.message).should.match('User is not logged in');

				// Handle Competency error error
				done(competencyDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Competency.remove().exec();
		done();
	});
});