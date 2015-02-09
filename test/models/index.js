'use strict';

var fs = require('fs'),
    path = require('path'),
    models = {};

exports.models = function(sequelize) {
    fs
        .readdirSync(__dirname)
        .filter(function(file) {
            return (file.indexOf('.')!== 0) && (file !== 'index.js');
        })
        .forEach(function(file) {
            var model = sequelize.import(path.join(__dirname, file));
            models[model.name] = model;
        });

    Object.keys(models).forEach(function(name) {
        if ('associate' in models[name]) {
            models[name].associate(models);
        }
    });
    return models;
};



