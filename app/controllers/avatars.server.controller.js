'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Avatar = mongoose.model('Avatar'),
	_ = require('lodash');

/**
 * Create a Avatar
 */
exports.create = function(req, res) {
	var avatar = new Avatar(req.body);
	avatar.user = req.user;

	avatar.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(avatar);
		}
	});
};

/**
 * Show the current Avatar
 */
exports.read = function(req, res) {
	res.jsonp(req.avatar);
};

/**
 * Update a Avatar
 */
exports.update = function(req, res) {
	var avatar = req.avatar ;

	avatar = _.extend(avatar , req.body);

	avatar.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(avatar);
		}
	});
};

/**
 * Delete an Avatar
 */
exports.delete = function(req, res) {
	var avatar = req.avatar ;

	avatar.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(avatar);
		}
	});
};

/**
 * List of Avatars
 */
exports.list = function(req, res) { 
	Avatar.find().sort('-created').populate('user', 'displayName').exec(function(err, avatars) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(avatars);
		}
	});
};

/**
 * Avatar middleware
 */
exports.avatarByID = function(req, res, next, id) { 
	Avatar.findById(id).populate('user', 'displayName').exec(function(err, avatar) {
		if (err) return next(err);
		if (! avatar) return next(new Error('Failed to load Avatar ' + id));
		req.avatar = avatar ;
		next();
	});
};

/**
 * Avatar authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.avatar.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
