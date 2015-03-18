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
        unique: true,
		trim: true
	},
    createdBy: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    summary: {
        type: String,
        default: ''
    },
    presentation: {
        type: String,
        default: ''
    },
    members: [{
        user: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        role: {
            type: String
        },
        _id: false
    }],
    guild: [{
        type: Schema.ObjectId,
        ref: 'Guild'
    }],
    competencies: [{
        type: Schema.ObjectId,
        ref: 'Competence'
    }],
    themes: [{
        type: Schema.ObjectId,
        ref: 'Theme'
    }],
    steps: [{
        number: {
            type: Number
        },
        tasks: [{
            type: Schema.ObjectId,
            ref: 'Task'
        }]
    }],
    game: [{
        cards: [{
            type: Schema.ObjectId,
            ref: 'Card'
        }],
        pattern: {
            type: Schema.ObjectId,
            ref: 'Pattern'
        }
    }],
	createdOn: {
		type: Date,
		default: Date.now
	},
    modifiedOn: {
        type: Date,
        default: Date.now
    }
});

/**
 * Mission methods
 */
MissionSchema.methods.addUser = function(userId, userIdToAdd, userRoleToAdd){
    MissionSchema.methods.verifyRole(userId, 'admin', function(){
        var userToAdd = {
            user: userIdToAdd,
            role: userRoleToAdd
        };
        this.model('Mission').members.push(userToAdd, function(){
            console.log(userToAdd + ' ajouté');
        });
    });
};

MissionSchema.methods.deleteTaskFromMission = function(userId, taskToRemove){
    //Vérifie si la personne appelant cette méthode est admin dans la mission
    MissionSchema.methods.verifyRole(userId, 'admin', function(){
        this.model('Mission').steps.remove({tasks: taskToRemove}, function(){
            console.log('Tâche ' + taskToRemove + ' supprimée');
        });
    });
};

MissionSchema.methods.deleteStepFromMission = function(userId, stepToRemove){
    //Vérifie si la personne appelant cette méthode est admin dans la mission
    MissionSchema.methods.verifyRole(userId, 'admin', function(){
        this.model('Mission').steps.remove({number: stepToRemove}, function(){
            console.log('Étape ' + stepToRemove + ' supprimée');
        });
    });
};

MissionSchema.methods.deleteMission = function(userId, missionId){
    //Vérifie si la personne appelant cette méthode est admin dans la mission
    MissionSchema.methods.verifyRole(userId, 'admin', function(){
        this.model('Mission').remove({_id: missionId}, function(){
            console.log('Mission ' + missionId + ' supprimée');
        });
    });
};

MissionSchema.methods.verifyRole = function(userId, userRole, cb){
    return this.model('Mission').members.findOne({user : userId}, function(foundMember){
        if(userRole.indexOf(foundMember.role) > -1){
            return cb;
        }
        else{
            return console.log('Vous n\'avez pas accès à cela');
        }
    });
};

mongoose.model('Mission', MissionSchema);
