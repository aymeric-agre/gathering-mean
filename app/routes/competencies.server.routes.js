'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var competencies = require('../../app/controllers/competencies.server.controller');

	// Competencies Routes
	app.route('/competencies')
		.get(competencies.list)
		.post(users.requiresLogin, competencies.create);

	app.route('/competencies/:competencyId')
		.get(competencies.read)
		.put(users.requiresLogin, competencies.hasAuthorization, competencies.update)
		.delete(users.requiresLogin, competencies.hasAuthorization, competencies.delete);

	// Finish by binding the Competency middleware
	app.param('competencyId', competencies.competencyByID);
};
