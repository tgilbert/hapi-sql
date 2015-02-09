'use strict';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('user', {
        username: DataTypes.STRING(45),
        password: DataTypes.CHAR(32),
        fName: DataTypes.STRING(45),
        lName: DataTypes.STRING(45)
    },{
        classMethods: {
            associate: function(models) {
                models.user.hasMany(models.task);
            }
        }
    });
};
