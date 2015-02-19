# hapi-sql
A [sequelize](http://sequelizejs.com/) plugin for [hapi.js](http://hapijs.com/)

## Installation
    npm install hapi-sql --save

## Add plugin
Use [hapi plugin register function](http://hapijs.com/api#plugins)

## Options
Defaults:

    {
        modelsPath: '/path/to/models',
        database: 'dbName',
        user: 'uName',
        password: 'password',
        dialect: 'mysql',
        port: 3306,
        host: 'localhost',
        sync: {
            force: false
        }
    }
Additionally you can pass any other sequelize parameters.

## Usage
If you are adding models use the following `index.js` file in your models folder.

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
This will return all models in the directory and associated them as necessary.
Models should be on their own file.

    module.exports = function(sequelize, DataTypes) {
        return sequelize.define('task', {
            description: DataTypes.STRING,
            isDone: DataTypes.BOOLEAN
        },{
            classMethods: {
                associate: function(models) {
                    models.task.belongsTo(models.user);
                }
            }
        });
    };
Note the class method `associate()`.

After registering the plugin you can assess sequelize(object), Sequelize(function), and db(models);

    server.plugins['hapi-sql'].database.sequelize;
    server.plugins['hapi-sql'].database.Sequelize;
    server.plugins['hapi-sql'].database.models;
