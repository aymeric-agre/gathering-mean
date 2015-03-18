'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Mission = mongoose.model('Mission'),
	_ = require('lodash');

/**
 * Create a Mission
 */
exports.create = function(req, res) {
	var mission = new Mission(req.body);
	mission.createdBy = req.user;
    mission.members.push({user : req.user._id, roles:['admin']});

	mission.save(function(err) {
		if (err) {
            console.log('erreur : ' + err);
            console.log('mission : ' + mission);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mission);
		}
	});
};

/**
 * Show the current Mission
 */
exports.read = function(req, res) {
	res.jsonp(req.mission);
};

/**
 * Update a Mission
 */
exports.update = function(req, res) {
	var mission = req.mission ;

	mission = _.extend(mission , req.body);

	mission.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mission);
		}
	});
};

/**
 * Delete an Mission
 */
exports.delete = function(req, res) {
	var mission = req.mission ;

	mission.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mission);
		}
	});
};

/**
 * List of Missions
 */
exports.list = function(req, res) { 
	Mission.find().sort('-created').populate('createdBy members').exec(function(err, missions) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(missions);
		}
	});
};

/**
 * Mission middleware
 */
exports.missionByID = function(req, res, next, id) { 
	Mission.findById(id).populate('createdBy', 'displayName').exec(function(err, mission) {
		if (err) return next(err);
		if (! mission) return next(new Error('Failed to load Mission ' + id));
		req.mission = mission ;
		next();
	});
};

/**
 * Mission authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.mission.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
