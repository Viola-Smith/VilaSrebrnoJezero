const { Sequelize, sequelize } = require('../../server');


const RoomType = sequelize.define('room_types', {
    // attributes
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      }
  }, {
      
  });

module.exports = {'RoomType' : RoomType}