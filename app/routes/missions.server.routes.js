'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var missions = require('../../app/controllers/missions.server.controller');

	// Missions Routes
	app.route('/missions')
		.get(missions.list)
		.post(users.requiresLogin, missions.create);

	app.route('/missions/:missionId')
		.get(missions.read)
		.put(users.requiresLogin, missions.hasAuthorization, missions.update)
		.delete(users.requiresLogin, missions.hasAuthorization, missions.delete);

	// Finish by binding the Mission middleware
	app.param('missionId', missions.missionByID);
};
