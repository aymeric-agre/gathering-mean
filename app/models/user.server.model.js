'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    fs = require('fs'),
    crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
    return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
    return (this.provider !== 'local' || (password && password.length > 6));
};

/**
 * User Schema
 */
var UserSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Please fill in your first name']
    },
    lastName: {
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Please fill in your last name']
    },
    email: {
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Please fill in your email'],
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    displayName: {
        type: String
    },
    username: {
        type: String,
        unique: true,
        required: 'Please fill in a username',
        trim: true
    },
    gender: {
        type: String,
        required: 'Please fill in your gender'
    },
    password: {
        type: String,
        default: '',
        validate: [validateLocalStrategyPassword, 'Password should be longer']
    },
    salt: {
        type: String
    },
    provider: {
        type: String,
        required: 'Provider is required'
    },
    providerData: {},
    additionalProvidersData: {},
    roles: {
        type: [{
            type: String,
            enum: ['user', 'admin']
        }],
        default: ['user']
    },
    profile: {
        friends: [{
            type: Schema.ObjectId,
            ref: 'User'
        }],
        mainGuilds: [{
            type: Schema.ObjectId,
            ref: 'Guild'
        }],
        guilds: [{
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
        messages: [{
            type: Schema.ObjectId,
            ref: 'Message'
        }],
        country: {
            type: String,
            required: false
        },
        area: {
            type: String,
            required: false
        },
        town: {
            type: String,
            required: false
        }
    },
    mission: {
        currentMissions: [{
            mission: {type: Schema.ObjectId, ref: 'Mission'},
            step: {type: Number}
        }],
        achievedMissions: [{
            type: Schema.ObjectId,
            ref: 'Mission'
        }],
        tasksToDo: [{
            type: Schema.ObjectId,
            ref: 'Task'
        }],
        weeklyTasks: [{
            type: Schema.ObjectId,
            ref: 'Task'
        }]
    },
    game: {
        experience: {type: Number},
        level: {
            levelNumber: {type: Number},
            expToLevel: {type: Number}
        },
        currentAvatar: {
            type: Schema.ObjectId,
            ref: 'Avatar'
        },
        availableAvatars: [{
            type: Schema.ObjectId,
            ref: 'Avatar'
        }],
        gold: {type: Number},
        cards: [{
            type: Schema.ObjectId,
            ref: 'Card'
        }],
        patterns: [{
            type: Schema.ObjectId,
            ref: 'Pattern'
        }],
        deck: [{
            type: Schema.ObjectId,
            ref: 'Card'
        }],
        designs: [{type: String}],
        currentDesign: {type: String}
    },
    updatedOn: {
        type: Date
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    /* For reset password */
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
    if (this.password && this.password.length > 6) {
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
    } else {
        return password;
    }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
    return this.password === this.hashPassword(password);
};

/**
 * Save
 * @param imgPath
 */
//UserSchema.methods.savePicture = function(imgPath){
//    var _this = this;
//    _this.model('User').profile.picture.data = fs.readFileSync(imgPath);
//    _this.model('User').profile.picture.contentType = 'image/png';
//    _this.save(function(err){
//        if(err){
//            throw err;
//        }
//        console.log('Image save to mongo');
//    });
//};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
    var _this = this;
    var possibleUsername = username + (suffix || '');

    _this.findOne({
        username: possibleUsername
    }, function(err, user) {
        if (!err) {
            if (!user) {
                callback(possibleUsername);
            } else {
                return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
            }
        } else {
            callback(null);
        }
    });
};

/**
 * @brief Trouver des utilisateurs par nom, prénom, pseudo
 * @param inputName
 * @returns {Array}
 */

UserSchema.statics.findUsersByName = function(inputName){
    var _this = this;
    var users = [];
    var names = inputName.split(' ');
    var conti = false;
    names.forEach(function(name, index, array){
        _this.find({$or: [{'firstName': name}, {'lastName': name}, {'username': name}]}, function(err, foundUsers){
            if(!err){
                foundUsers.forEach(function(foundUser){
                    if(foundUser.indexOf(users) < 0){
                        users.push(foundUser);
                    }
                });
            }
            if(index === array.length - 1){
                conti = true;
            }
        });
    });
    if(conti === true){
        return users;
    }
};

/*  *****
 GAMES
 *****   */

/**
 * @brief ajouter de l'expérience
 * @param experienceToAdd
 */
UserSchema.methods.addExp = function(experienceToAdd){
    var _this = this;
    var currentExp = _this.model('User').game.experience;
    var currentLvl = _this.model('User').game.level.levelNumber;
    var expToLvl = _this.model('User').game.level.expToLevel;
    if(experienceToAdd < expToLvl){
        currentExp += experienceToAdd;
    }
    else{
        currentExp = experienceToAdd - expToLvl;
        currentLvl++;
    }
};

/**
 * @brief ajout de gold
 * @param goldToAdd
 */
UserSchema.methods.addGold = function(goldToAdd){
    var _this = this;
    var currentGold = _this.model('User').game.gold;
    currentGold += goldToAdd;
};

/**
 * @brief soustraire du gold
 * @param goldToRemove
 */
UserSchema.methods.removeGold = function(goldToRemove){
    var _this = this;
    var currentGold = _this.model('User').game.gold;
    if(currentGold >= goldToRemove){
        currentGold -= goldToRemove;
    }
};

/**
 * @brief ajouter un design
 * @param designToAdd
 */
UserSchema.methods.addDesign = function(designToAdd){
    var _this = this;
    var designs = _this.model('User').game.designs;
    if(designToAdd.indexOf(designs) < 0){
        designs.push(designToAdd);  //Sous quelle forme ? id ? chaîne de carac ?
    }
};

/**
 * @brief changement du design
 * @param designToUpdate
 */
UserSchema.methods.updateDesign = function(designToUpdate){
    var _this = this;
    var currentDesign = _this.model('User').game.currentDesign;
    if(designToUpdate !== currentDesign){
        currentDesign = designToUpdate;
    }
};

/**
 * @brief ajoute des cartes au deck
 * @param cardsToAdd    tableau d'id de cartes
 */
UserSchema.methods.addCards = function(cardsToAdd){
    var _this = this;
    var deck = _this.model('User').game.deck;
    cardsToAdd.forEach(function(card){
        deck.push(card);
    });
};

/**
 * @brief ajoute un pattern pour assembler des cartes
 * @param patternToAdd
 */
UserSchema.methods.addPattern = function(patternToAdd){
    var _this = this;
    var patterns = _this.model('User').game.patterns;
    if(patternToAdd.indexOf(patterns) < 0){
        patterns.push(patternToAdd);
    }
};

/**
 * @brief renvoie le deck (tableau d'id)
 * @returns {*}
 */
UserSchema.methods.getDeck = function(){
    var _this = this;
    return _this.model('User').game.deck;
};

/**
 * @brief choix des cartes constituant le deck
 * @param selectedCards
 */
UserSchema.methods.setDeck = function(selectedCards){
    var _this = this;
    var deck = _this.model('User').game.deck;
    deck = [];
    selectedCards.forEach(function(card){
        deck.push(card);
    });
};

/** A FINIR
 * @brief se désinscrire d'une mission
 * @param currentMissionId
 */
UserSchema.methods.withdraw = function(currentMissionId){
    var _this = this;
    var currentMissions = _this.model('User').mission.currentMissions;
    var tasksToDo = _this.model('User').mission.tasksToDo;
    var weeklyTasks = _this.model('User').mission.weeklyTasks;
    currentMissions[currentMissionId.indexOf(currentMissions)].delete();
};

/**
 * @brief quand une mission est terminée
 * @param achievedMission
 */
UserSchema.methods.achieveMission = function(achievedMission){
    var _this = this;
    var achievedMissions = _this.model('User').mission.achievedMissions;
    var currentMissions = _this.model('User').mission.currentMissions;
    UserSchema.methods.addPattern(achievedMission.pattern);
    UserSchema.methods.withdraw(achievedMission._id);
    achievedMissions.push(achievedMission);
};



mongoose.model('User', UserSchema);
