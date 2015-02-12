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
	createdOn: { //Date de création du message
		type: Date,
		default: Date.now
	},
    sendedOn: {
        type: Date,
        default: Date.now
    },
	userSender: { //Expéditeur du message
		type: Schema.ObjectId,
		ref: 'User'
	},
    userRecipient: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    subject: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        default: ''
    },
    viewed: {
        type: Boolean,
        default: false
    }
});

mongoose.model('Message', MessageSchema);
