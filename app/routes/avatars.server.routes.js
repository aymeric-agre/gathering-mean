'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var avatars = require('../../app/controllers/avatars.server.controller');

	// Avatars Routes
	app.route('/avatars')
		.get(avatars.list)
		.post(users.requiresLogin, avatars.create);

	app.route('/avatars/:avatarId')
		.get(avatars.read)
		.put(users.requiresLogin, avatars.hasAuthorization, avatars.update)
		.delete(users.requiresLogin, avatars.hasAuthorization, avatars.delete);

	// Finish by binding the Avatar middleware
	app.param('avatarId', avatars.avatarByID);
};
