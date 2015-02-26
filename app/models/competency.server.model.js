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
	createdOn: {
		type: Date,
		default: Date.now
	},
	users: [{
		type: Schema.ObjectId,
		ref: 'User'
	}],
    missions: [{
        type: Schema.ObjectId,
        ref: 'Mission'
    }],
    tasks: [{
        type: Schema.ObjectId,
        ref: 'Task'
    }]
});

/**
 * Competency methods
 */

/**
 * @brief Ajoute une mission qui contient cette compétence
 * @param userId Utilisateur qui cherche à ajouter une mission à cette compétence
 * @param missionIdToAdd Mission à ajouter
 */
CompetencySchema.methods.addMission = function(userId, missionIdToAdd){
    CompetencySchema.methods.verifyRole(userId, 'admin', function(){
        this.model('Competency').missions.push(missionIdToAdd, function(){
            console.log(missionIdToAdd + ' ajoutée');
        });
    });
};

/**
 * @brief Ajoute un utilisateur qui contient cette compétence
 * @param userId Utilisateur qui cherche à ajouter un utilisateur à cette compétence
 * @param userIdToAdd Utilisateur à ajouter
 */
CompetencySchema.methods.addUser = function(userId, userIdToAdd){
    CompetencySchema.methods.verifyRole(userId, 'admin', function(){
        this.model('Competency').users.push(userIdToAdd, function(){
            console.log(userIdToAdd + ' ajouté(e)');
        });
    });
};

/**
 * @brief Ajoute une tache qui contient cette compétence
 * @param userId Utilisateur qui cherche à ajouter une tache à cette compétence
 * @param taskIdToAdd Id de la tache à ajouter
 */
CompetencySchema.methods.addTask = function(userId, taskIdToAdd){
    CompetencySchema.methods.verifyRole(userId, 'admin', function(){
        this.model('Competency').tasks.push(taskIdToAdd, function(){
            console.log(taskIdToAdd + ' ajoutée');
        });
    });
};

/**
 * @brief Ajoute une mission qui contient cette compétence
 * @param userId Utilisateur qui cherche à ajouter une tache à cette compétence
 * @param missionIdToAdd Id de la mission à ajouter
 */
CompetencySchema.methods.addMission = function(userId, missionIdToAdd){
    CompetencySchema.methods.verifyRole(userId, 'admin', function(){
        this.model('Competency').missions.push(missionIdToAdd, function(){
            console.log(missionIdToAdd + ' ajoutée');
        });
    });
};

/**
 * @brief Vérifie qu'un utilisateur a assez de droits pour accéder à une méthode.
 * @param userId Utilisateur qui veut faire un truc
 * @param userRole Role qu'on cherche pour l'utilisateur
 * @param cb Callback : si l'utilisateur a le rôle
 * @returns {*} cf callback
 */
CompetencySchema.methods.verifyRole = function(userId, userRole, cb){
    return this.model('Mission').members.findOne({user : userId}, function(foundMember){
        if(userRole.indexOf(foundMember.role) > -1){
            return cb;
        }
        else{
            return console.log('Vous n\'avez pas accès à cela');
        }
    });
};

mongoose.model('Competency', CompetencySchema);
