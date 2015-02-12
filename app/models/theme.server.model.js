'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Theme Schema
 */
var ThemeSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill Theme name',
        trim: true
    },
    created: {
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
 * Theme methods
 */

/**
 * @brief Ajoute une mission qui contient cette thème
 * @param userId Utilisateur qui cherche à ajouter une mission à cette thème
 * @param missionIdToAdd Mission à ajouter
 */
ThemeSchema.methods.addMission = function(userId, missionIdToAdd){
    ThemeSchema.methods.verifyRole(userId, 'admin', function(){
        this.model('Theme').missions.push(missionIdToAdd, function(){
            console.log(missionId + ' ajoutée');
        });
    });
};

/**
 * @brief Ajoute un utilisateur qui contient cette thème
 * @param userId Utilisateur qui cherche à ajouter un utilisateur à cette thème
 * @param userIdToAdd Utilisateur à ajouter
 */
ThemeSchema.methods.addUser = function(userId, userIdToAdd){
    ThemeSchema.methods.verifyRole(userId, 'admin', function(){
        this.model('Theme').users.push(userIdToAdd, function(){
            console.log(userIdToAdd + ' ajouté(e)');
        });
    });
};

/**
 * @brief Ajoute une tache qui contient cette thème
 * @param userId Utilisateur qui cherche à ajouter une tache à cette thème
 * @param taskIdToAdd Id de la tache à ajouter
 */
ThemeSchema.methods.addTask = function(userId, taskIdToAdd){
    ThemeSchema.methods.verifyRole(userId, 'admin', function(){
        this.model('Theme').tasks.push(taskIdToAdd, function(){
            console.log(taskIdToAdd + ' ajoutée');
        });
    });
};

/**
 * @brief Ajoute une mission qui contient cette thème
 * @param userId Utilisateur qui cherche à ajouter une tache à cette thème
 * @param missionIdToAdd Id de la mission à ajouter
 */
ThemeSchema.methods.addMission = function(userId, missionIdToAdd){
    ThemeSchema.methods.verifyRole(userId, 'admin', function(){
        this.model('Theme').missions.push(missionIdToAdd, function(){
            console.log(missionId + ' ajoutée');
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
ThemeSchema.methods.verifyRole = function(userId, userRole, cb){
    return this.model('Mission').members.findOne({user : userId}, function(foundMember){
        if(userRole.indexOf(foundMember.role) > -1){
            return cb;
        }
        else{
            return console.log('Vous n\'avez pas accès à cela');
        }
    });
};

mongoose.model('Theme', ThemeSchema);
