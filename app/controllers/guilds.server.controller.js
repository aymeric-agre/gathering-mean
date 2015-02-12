'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Guild = mongoose.model('Guild'),
	_ = require('lodash');

/**
 * Create a Guild
 */
exports.create = function(req, res) {
	var guild = new Guild(req.body);
	guild.user = req.user;

	guild.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(guild);
		}
	});
};

/**
 * Show the current Guild
 */
exports.read = function(req, res) {
	res.jsonp(req.guild);
};

/**
 * Update a Guild
 */
exports.update = function(req, res) {
	var guild = req.guild ;

	guild = _.extend(guild , req.body);

	guild.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(guild);
		}
	});
};

/**
 * Delete an Guild
 */
exports.delete = function(req, res) {
	var guild = req.guild ;

	guild.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(guild);
		}
	});
};

/**
 * List of Guilds
 */
exports.list = function(req, res) { 
	Guild.find().sort('-created').populate('user', 'displayName').exec(function(err, guilds) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(guilds);
		}
	});
};

/**
 * Guild middleware
 */
exports.guildByID = function(req, res, next, id) { 
	Guild.findById(id).populate('user', 'displayName').exec(function(err, guild) {
		if (err) return next(err);
		if (! guild) return next(new Error('Failed to load Guild ' + id));
		req.guild = guild ;
		next();
	});
};

/**
 * Guild authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.guild.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
