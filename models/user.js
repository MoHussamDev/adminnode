const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const User = sequelize.define('user', {
id:{
    type:Sequelize.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true
},
firstname:{
    type:Sequelize.STRING,
},
lastname:{
    type:Sequelize.STRING,
},
email:{
    type:Sequelize.STRING,
    allowNull: false,
    validate:{
        isEmail:true
    }
},
password:{
    type:Sequelize.STRING,
},
image:{
    type:Sequelize.STRING,
}
}

);

module.exports = User;



