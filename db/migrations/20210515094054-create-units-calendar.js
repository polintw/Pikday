'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('units_calendar', {
      id_unit: {
        type: Sequelize.UUID,
        allowNull: false
      },
      assignedDate: {
        type: Sequelize.DATEONLY,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    }).then(()=>{
      return queryInterface.addConstraint('units_calendar', ['id_unit'], {
        type: 'foreign key',
        name: 'constraint_fkey_unitsCalendar_idunit',
        references: { //Required field
          table: 'units',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('units_calendar');
  }
};
