'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var guilds = require('../../app/controllers/guilds.server.controller');

	// Guilds Routes
	app.route('/guilds')
		.get(guilds.list)
		.post(users.requiresLogin, guilds.create);

	app.route('/guilds/:guildId')
		.get(guilds.read)
		.put(users.requiresLogin, guilds.hasAuthorization, guilds.update)
		.delete(users.requiresLogin, guilds.hasAuthorization, guilds.delete);

	// Finish by binding the Guild middleware
	app.param('guildId', guilds.guildByID);
};
