'use strict';

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
