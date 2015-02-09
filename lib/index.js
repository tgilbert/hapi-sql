'use strict';

var fs = require('fs'),
    async = require('async'),
    Sequelize = require('sequelize'),
    Hoek = require('hoek'),
    db = {};

exports.register = function(server, options, next) {
    var defaults = {
        modelsPath: '',
        database: '',
        user: '',
        password: '',
        dialect: 'mysql',
        port: 3306,
        host: 'localhost',
        syncOptions: {
            force: false
        }
    };
    var settings = Hoek.applyToDefaults(defaults, options);

    Hoek.assert(settings.database, 'options.database not defined');
    Hoek.assert(settings.user, 'options.user not defined');
    Hoek.assert(settings.password, 'options.password not defined');

    var user = settings.user,
        database = settings.database,
        password = settings.password,
        modelsPath = settings.modelsPath,
        syncOptions = settings.syncOptions;

    delete settings.user;
    delete settings.database;
    delete settings.password;
    delete settings.modelsPath;
    delete settings.syncOptions;

    var sequelize = new Sequelize(database, user, password, settings);

    if (settings.modelsPath) {
        db.models = require(modelsPath).models(sequelize);
    }

    // TODO: try to chain sequelize
    async.series([
        function(callback) {
            sequelize
                .authenticate()
                .then(function() {
                    callback();
                })
                .catch(function authException(err) {
                    console.log(err);
                    callback(err);
                });
        },
        function(callback) {
            console.log('here dude');
            sequelize
                .sync(syncOptions)
                .then(function() {
                    callback();
                })
                .catch(function syncException(err) {
                    callback(err);
                });
        }],
        function(err) {
            if (err) {
            console.log('here bro');
                next(err);
            }
            db.sequelize = sequelize;
            db.Sequelize = Sequelize;

            server.expose('database', db);
            next();
        }
    );
};

exports.register.attributes = {
    pkg: require('../package.json')
};
