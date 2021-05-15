'use strict';
module.exports = (sequelize, DataTypes) => {
  const units_calendar = sequelize.define('units_calendar', {
    id_unit: DataTypes.UUID,
    assignedDate: DataTypes.DATEONLY,
    id_author: DataTypes.INTEGER,
    author_identity: DataTypes.STRING,
    used_authorId: DataTypes.INTEGER,
  }, {});
  units_calendar.associate = function(models) {
    units_calendar.belongsTo(models.units, {
      foreignKey:"id_unit",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    units_calendar.belongsTo(models.users, {
      foreignKey:"id_author",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  units_calendar.removeAttribute('id'); //this model do not use 'id' nor any pk, so we need to tell it.

  return units_calendar;
};
