'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Pattern Schema
 */
var PatternSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Pattern name',
		trim: true
	},
	createdOn: {
		type: Date,
		default: Date.now
	},
    cards: [{
        type: Schema.ObjectId,
        ref: 'Card'
    }]
});

mongoose.model('Pattern', PatternSchema);
