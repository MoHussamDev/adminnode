const Cat = require('../models/categoryModel');
const Products = require('../models/productModel');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const  fileController = require('../util/file');

exports.getProducts = (cb) => {

Products.findAll({
    raw:true,
    include: [{

        model: Cat,
    }],
    attributes: ['*',[Sequelize.col("category.categoryName"),'catName']]
}).then(result=>cb(null,result)).catch(err=>cb(err,null))


}

exports.insertProduct = (user,data,image,cb)=>{
// cb(null,user);
Products.create({
    productName:data.productName,
    productDesc:data.productDesc,
    price:data.price,
    imageUrl:image,
    categoryId:data.category,
    userId:user.id
}).then(result=>cb(null,result)).catch(err=>cb(err,null))
}