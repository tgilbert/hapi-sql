'use strict';

var fs = require('fs'),
    path = require('path'),
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
        sync: {
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
        modelsPath = settings.modelsPath;

    delete settings.user;
    delete settings.database;
    delete settings.password;
    delete settings.modelsPath;

    var sequelize = new Sequelize(database, user, password, settings);

    if (modelsPath) {
        var thePath = path.join(path.dirname(__dirname), modelsPath);
        db.models = require(thePath).models(sequelize);
    }

    sequelize
        .sync()
        .then(function() {
            db.sequelize = sequelize;
            db.Sequelize = Sequelize;

            server.expose('database', db);
            next();
        })
        .catch(function(err) {
            next(err);
        });
};

exports.register.attributes = {
    pkg: require('../package.json')
};
