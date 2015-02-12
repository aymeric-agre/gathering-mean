'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Competency = mongoose.model('Competency'),
	_ = require('lodash');

/**
 * Create a Competency
 */
exports.create = function(req, res) {
	var competency = new Competency(req.body);
	competency.user = req.user;

	competency.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(competency);
		}
	});
};

/**
 * Show the current Competency
 */
exports.read = function(req, res) {
	res.jsonp(req.competency);
};

/**
 * Update a Competency
 */
exports.update = function(req, res) {
	var competency = req.competency ;

	competency = _.extend(competency , req.body);

	competency.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(competency);
		}
	});
};

/**
 * Delete an Competency
 */
exports.delete = function(req, res) {
	var competency = req.competency ;

	competency.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(competency);
		}
	});
};

/**
 * List of Competencies
 */
exports.list = function(req, res) { 
	Competency.find().sort('-created').populate('user', 'displayName').exec(function(err, competencies) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(competencies);
		}
	});
};

/**
 * Competency middleware
 */
exports.competencyByID = function(req, res, next, id) { 
	Competency.findById(id).populate('user', 'displayName').exec(function(err, competency) {
		if (err) return next(err);
		if (! competency) return next(new Error('Failed to load Competency ' + id));
		req.competency = competency ;
		next();
	});
};

/**
 * Competency authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.competency.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
