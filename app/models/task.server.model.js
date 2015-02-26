'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Task Schema
 */
var TaskSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Task name',
		trim: true
	},
	createdOn: {
        type: Date,
        default: Date.now
    },
    missions: [{
        type: Schema.ObjectId,
        ref: 'Mission'
    }],
    users: [{ //Liste de tous les gens qui font la tâche actuellement
        type: Schema.ObjectId,
        ref: 'User'
    }],
    currentUser: { //User qui a téléchargé cette copie de la tâche
        type: Schema.ObjectId,
        ref: 'User'
    },
    competencies: [{
        type: Schema.ObjectId,
        ref: 'Competency'
    }],
    themes: [{
        type: Schema.ObjectId,
        ref: 'Theme'
    }],
    weeklyTask: {
        type: Boolean,
        default: false
    },
    achieved: { //N'a un intérêt que sur les "copies" de la task
        type: Boolean,
        default: false
    },
    result: { //Résultat obtenu pour cette tâche. Valeur chiffrée. N'est pas requise.
        type: Number,
        default: 0
    },
    gold: {
        type: Number,
        default: 0
    }
});

/*
 * Task methods
 */

/**
 * @brief Teste si un résultat a la valeur attendue
 * @param resultTeste Valeur à laquelle on compare result
 * @param userId Utilisateur dont on teste le résultat
 */
TaskSchema.methods.checkResult = function(resultTeste){
    if(resultTeste<=this.model('Task').result) { //Si on a assez de points
        for(var i=0;i<this.model('Task').missions.size;i++) {
            currentUser.achieveTask(this.model('Task')._id,this.model('Task').missions(i));
        }
    }
    else
    {
        console.log('Result ne match pas.');
    }
};


mongoose.model('Task', TaskSchema);
