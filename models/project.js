'use strict';

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Draft'
    }
  });

  Project.associate = function(models) {
    Project.hasMany(models.Task, {
      foreignKey: 'projectId',
      as: 'tasks' 
    });
  };

  return Project;
};
