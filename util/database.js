const Sequelize = require('sequelize');


const sequelize = new Sequelize('admin','root', null ,{
    dialect:'mariadb',
    host: 'localhost',
});


module.exports = sequelize ;