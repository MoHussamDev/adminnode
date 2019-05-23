const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const Category = sequelize.define('category', {
id:{
    type:Sequelize.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true
},
categoryName:{
    type:Sequelize.STRING,
    allowNull:false

},
categoryDesc:{
    type:Sequelize.STRING,
    allowNull:false

},

imageUrl:{
    type:Sequelize.STRING,
    allowNull:true
}
}

);

module.exports = Category;



