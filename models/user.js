/**
 * Created by jasper on 5/3/14.
 */
var db = require('../data-sources/db');
var loopback = require('loopback');
var Role = require('loopback/lib/models/role').Role;
var ACL = require('loopback/lib/models/acl').ACL;
var Image = require('./image');
var DEFAULT_TTL = 1209600;
var app = require('./../app');
var async = require('async');

var properties = {
    realm: {type: String},
    username: {type: String},
    password: {type: String, required: true},
    email: {type: String, required: true},
    emailVerified: Boolean,
    verificationToken: String,

    phone: {type:String, required: true},

    credentials: [
        'UserCredential' // User credentials, private or public, such as private/public keys, Kerberos tickets, oAuth tokens, facebook, google, github ids
    ],
    challenges: [
        'Challenge' // Security questions/answers
    ],
    // https://en.wikipedia.org/wiki/Multi-factor_authentication
    /*
     factors: [
     'AuthenticationFactor'
     ],
     */
    status: String,
    created: Date,
    lastUpdated: Date
};

var options = {
    hidden: ['password'],
    acls: [
        {
            principalType: ACL.ROLE,
            principalId: Role.EVERYONE,
            permission: ACL.DENY
        },
        {
            principalType: ACL.ROLE,
            principalId: Role.EVERYONE,
            permission: ACL.ALLOW,
            property: 'create'
        },
        {
            principalType: ACL.ROLE,
            principalId: Role.OWNER,
            permission: ACL.ALLOW,
            property: 'removeById'
        },
        {
            principalType: ACL.ROLE,
            principalId: Role.EVERYONE,
            permission: ACL.ALLOW,
            property: "login"
        },
        {
            principalType: ACL.ROLE,
            principalId: Role.EVERYONE,
            permission: ACL.ALLOW,
            property: "logout"
        },
        {
            principalType: ACL.ROLE,
            principalId: Role.OWNER,
            permission: ACL.ALLOW,
            property: "findById"
        },
        {
            principalType: ACL.ROLE,
            principalId: Role.OWNER,
            permission: ACL.ALLOW,
            property: "updateAttributes"
        },
        {
            principalType: ACL.ROLE,
            principalId: Role.EVERYONE,
            permission: ACL.ALLOW,
            property: "confirm"
        },
        {
            principalType: ACL.ROLE,
            principalId: Role.EVERYONE,
            permission: ACL.ALLOW,
            property: "__get__image"
        },
        {
            principalType: ACL.ROLE,
            principalId: Role.EVERYONE,
            permission: ACL.ALLOW,
            property: "leading_games"
        }
    ],
    relations: {
        accessTokens: {
            type: 'hasMany',
            model: 'AccessToken',
            foreignKey: 'userId'
        },
        games_where_lead: {
            type: 'hasAndBelongsToMany',
            model: 'Game'
        },
        image: {
            type: 'belongsTo',
            model: 'Image',
            foreignKey: 'image_id'
        }
    },
    base: 'User'
};

var user = module.exports = db.createModel(
    'user',
    properties,
    options
);

user.prototype.leading_games = function(callback) {
    var game = require('./game');
    var scenario = require('./scenario');
    game.find({where:{lead_id: this.id}, include:"scenario"}, function(err, games){
        async.mapSeries(games, function(g, callb){
            console.log (g.scenario());
            function fetch_image(game){
                scenario.findOne(
                    {where:{id:game.scenario()},include:"image"},
                    function(err, scn){
                        game.scenario(scn);
                        callb(null, game);
                    }
                );
            }
            fetch_image(g);

        }, function(err, games){
            callback(null, games);
        });
    });
};

loopback.remoteMethod(
    user.prototype.leading_games,
    {
        returns: {
            arg: 'games_collection', type: 'array', root: true, description:'games collection'
        }
    }
);

user.belongsTo(Image, {foreignKey: 'image_id'});
// attach to the db
user.attachTo(db);

