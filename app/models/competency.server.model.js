'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Competency Schema
 */
var CompetencySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Competency name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Competency', CompetencySchema);