'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Mission Schema
 */
var MissionSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Mission name',
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

mongoose.model('Mission', MissionSchema);