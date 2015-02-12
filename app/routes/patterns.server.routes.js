'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var patterns = require('../../app/controllers/patterns.server.controller');

	// Patterns Routes
	app.route('/patterns')
		.get(patterns.list)
		.post(users.requiresLogin, patterns.create);

	app.route('/patterns/:patternId')
		.get(patterns.read)
		.put(users.requiresLogin, patterns.hasAuthorization, patterns.update)
		.delete(users.requiresLogin, patterns.hasAuthorization, patterns.delete);

	// Finish by binding the Pattern middleware
	app.param('patternId', patterns.patternByID);
};
