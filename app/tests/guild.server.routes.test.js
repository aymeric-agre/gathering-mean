'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Guild = mongoose.model('Guild'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, guild;

/**
 * Guild routes tests
 */
describe('Guild CRUD tests', function() {
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

		// Save a user to the test db and create new Guild
		user.save(function() {
			guild = {
				name: 'Guild Name'
			};

			done();
		});
	});

	it('should be able to save Guild instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Guild
				agent.post('/guilds')
					.send(guild)
					.expect(200)
					.end(function(guildSaveErr, guildSaveRes) {
						// Handle Guild save error
						if (guildSaveErr) done(guildSaveErr);

						// Get a list of Guilds
						agent.get('/guilds')
							.end(function(guildsGetErr, guildsGetRes) {
								// Handle Guild save error
								if (guildsGetErr) done(guildsGetErr);

								// Get Guilds list
								var guilds = guildsGetRes.body;

								// Set assertions
								(guilds[0].user._id).should.equal(userId);
								(guilds[0].name).should.match('Guild Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Guild instance if not logged in', function(done) {
		agent.post('/guilds')
			.send(guild)
			.expect(401)
			.end(function(guildSaveErr, guildSaveRes) {
				// Call the assertion callback
				done(guildSaveErr);
			});
	});

	it('should not be able to save Guild instance if no name is provided', function(done) {
		// Invalidate name field
		guild.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Guild
				agent.post('/guilds')
					.send(guild)
					.expect(400)
					.end(function(guildSaveErr, guildSaveRes) {
						// Set message assertion
						(guildSaveRes.body.message).should.match('Please fill Guild name');
						
						// Handle Guild save error
						done(guildSaveErr);
					});
			});
	});

	it('should be able to update Guild instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Guild
				agent.post('/guilds')
					.send(guild)
					.expect(200)
					.end(function(guildSaveErr, guildSaveRes) {
						// Handle Guild save error
						if (guildSaveErr) done(guildSaveErr);

						// Update Guild name
						guild.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Guild
						agent.put('/guilds/' + guildSaveRes.body._id)
							.send(guild)
							.expect(200)
							.end(function(guildUpdateErr, guildUpdateRes) {
								// Handle Guild update error
								if (guildUpdateErr) done(guildUpdateErr);

								// Set assertions
								(guildUpdateRes.body._id).should.equal(guildSaveRes.body._id);
								(guildUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Guilds if not signed in', function(done) {
		// Create new Guild model instance
		var guildObj = new Guild(guild);

		// Save the Guild
		guildObj.save(function() {
			// Request Guilds
			request(app).get('/guilds')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Guild if not signed in', function(done) {
		// Create new Guild model instance
		var guildObj = new Guild(guild);

		// Save the Guild
		guildObj.save(function() {
			request(app).get('/guilds/' + guildObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', guild.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Guild instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Guild
				agent.post('/guilds')
					.send(guild)
					.expect(200)
					.end(function(guildSaveErr, guildSaveRes) {
						// Handle Guild save error
						if (guildSaveErr) done(guildSaveErr);

						// Delete existing Guild
						agent.delete('/guilds/' + guildSaveRes.body._id)
							.send(guild)
							.expect(200)
							.end(function(guildDeleteErr, guildDeleteRes) {
								// Handle Guild error error
								if (guildDeleteErr) done(guildDeleteErr);

								// Set assertions
								(guildDeleteRes.body._id).should.equal(guildSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Guild instance if not signed in', function(done) {
		// Set Guild user 
		guild.user = user;

		// Create new Guild model instance
		var guildObj = new Guild(guild);

		// Save the Guild
		guildObj.save(function() {
			// Try deleting Guild
			request(app).delete('/guilds/' + guildObj._id)
			.expect(401)
			.end(function(guildDeleteErr, guildDeleteRes) {
				// Set message assertion
				(guildDeleteRes.body.message).should.match('User is not logged in');

				// Handle Guild error error
				done(guildDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Guild.remove().exec();
		done();
	});
});