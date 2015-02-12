'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Pattern = mongoose.model('Pattern'),
	_ = require('lodash');

/**
 * Create a Pattern
 */
exports.create = function(req, res) {
	var pattern = new Pattern(req.body);
	pattern.user = req.user;

	pattern.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pattern);
		}
	});
};

/**
 * Show the current Pattern
 */
exports.read = function(req, res) {
	res.jsonp(req.pattern);
};

/**
 * Update a Pattern
 */
exports.update = function(req, res) {
	var pattern = req.pattern ;

	pattern = _.extend(pattern , req.body);

	pattern.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pattern);
		}
	});
};

/**
 * Delete an Pattern
 */
exports.delete = function(req, res) {
	var pattern = req.pattern ;

	pattern.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pattern);
		}
	});
};

/**
 * List of Patterns
 */
exports.list = function(req, res) { 
	Pattern.find().sort('-created').populate('user', 'displayName').exec(function(err, patterns) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(patterns);
		}
	});
};

/**
 * Pattern middleware
 */
exports.patternByID = function(req, res, next, id) { 
	Pattern.findById(id).populate('user', 'displayName').exec(function(err, pattern) {
		if (err) return next(err);
		if (! pattern) return next(new Error('Failed to load Pattern ' + id));
		req.pattern = pattern ;
		next();
	});
};

/**
 * Pattern authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.pattern.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
