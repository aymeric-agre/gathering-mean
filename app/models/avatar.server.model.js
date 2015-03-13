'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Avatar Schema
 */
var AvatarSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Avatar name',
		trim: true
	},
	createdOn: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Avatar', AvatarSchema);
