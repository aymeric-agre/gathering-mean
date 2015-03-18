'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Avatar = mongoose.model('Avatar'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, avatar;

/**
 * Avatar routes tests
 */
describe('Avatar CRUD tests', function() {
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

		// Save a user to the test db and create new Avatar
		user.save(function() {
			avatar = {
				name: 'Avatar Name'
			};

			done();
		});
	});

	it('should be able to save Avatar instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Avatar
				agent.post('/avatars')
					.send(avatar)
					.expect(200)
					.end(function(avatarSaveErr, avatarSaveRes) {
						// Handle Avatar save error
						if (avatarSaveErr) done(avatarSaveErr);

						// Get a list of Avatars
						agent.get('/avatars')
							.end(function(avatarsGetErr, avatarsGetRes) {
								// Handle Avatar save error
								if (avatarsGetErr) done(avatarsGetErr);

								// Get Avatars list
								var avatars = avatarsGetRes.body;

								// Set assertions
								(avatars[0].user._id).should.equal(userId);
								(avatars[0].name).should.match('Avatar Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Avatar instance if not logged in', function(done) {
		agent.post('/avatars')
			.send(avatar)
			.expect(401)
			.end(function(avatarSaveErr, avatarSaveRes) {
				// Call the assertion callback
				done(avatarSaveErr);
			});
	});

	it('should not be able to save Avatar instance if no name is provided', function(done) {
		// Invalidate name field
		avatar.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Avatar
				agent.post('/avatars')
					.send(avatar)
					.expect(400)
					.end(function(avatarSaveErr, avatarSaveRes) {
						// Set message assertion
						(avatarSaveRes.body.message).should.match('Please fill Avatar name');
						
						// Handle Avatar save error
						done(avatarSaveErr);
					});
			});
	});

	it('should be able to update Avatar instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Avatar
				agent.post('/avatars')
					.send(avatar)
					.expect(200)
					.end(function(avatarSaveErr, avatarSaveRes) {
						// Handle Avatar save error
						if (avatarSaveErr) done(avatarSaveErr);

						// Update Avatar name
						avatar.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Avatar
						agent.put('/avatars/' + avatarSaveRes.body._id)
							.send(avatar)
							.expect(200)
							.end(function(avatarUpdateErr, avatarUpdateRes) {
								// Handle Avatar update error
								if (avatarUpdateErr) done(avatarUpdateErr);

								// Set assertions
								(avatarUpdateRes.body._id).should.equal(avatarSaveRes.body._id);
								(avatarUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Avatars if not signed in', function(done) {
		// Create new Avatar model instance
		var avatarObj = new Avatar(avatar);

		// Save the Avatar
		avatarObj.save(function() {
			// Request Avatars
			request(app).get('/avatars')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Avatar if not signed in', function(done) {
		// Create new Avatar model instance
		var avatarObj = new Avatar(avatar);

		// Save the Avatar
		avatarObj.save(function() {
			request(app).get('/avatars/' + avatarObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', avatar.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Avatar instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Avatar
				agent.post('/avatars')
					.send(avatar)
					.expect(200)
					.end(function(avatarSaveErr, avatarSaveRes) {
						// Handle Avatar save error
						if (avatarSaveErr) done(avatarSaveErr);

						// Delete existing Avatar
						agent.delete('/avatars/' + avatarSaveRes.body._id)
							.send(avatar)
							.expect(200)
							.end(function(avatarDeleteErr, avatarDeleteRes) {
								// Handle Avatar error error
								if (avatarDeleteErr) done(avatarDeleteErr);

								// Set assertions
								(avatarDeleteRes.body._id).should.equal(avatarSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Avatar instance if not signed in', function(done) {
		// Set Avatar user 
		avatar.user = user;

		// Create new Avatar model instance
		var avatarObj = new Avatar(avatar);

		// Save the Avatar
		avatarObj.save(function() {
			// Try deleting Avatar
			request(app).delete('/avatars/' + avatarObj._id)
			.expect(401)
			.end(function(avatarDeleteErr, avatarDeleteRes) {
				// Set message assertion
				(avatarDeleteRes.body.message).should.match('User is not logged in');

				// Handle Avatar error error
				done(avatarDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Avatar.remove().exec();
		done();
	});
});