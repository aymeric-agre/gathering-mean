'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Message Schema
 */
var MessageSchema = new Schema({
    userSender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
	userRecipient: {
        type: String,
        //ref: 'User',
		required: 'Please fill Message userSender',
		trim: true
	},
    subject : {type : String},
    content : {type : String},
    sentOn: {
		type: Date,
		default: Date.now
	}

});

mongoose.model('Message', MessageSchema);
