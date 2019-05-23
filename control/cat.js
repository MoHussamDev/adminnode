const Cat = require('../models/categoryModel');
const Products = require('../models/productModel');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const  fileController = require('../util/file');


exports.getCats = (cb)=>{

Cat.findAll({
    attributes:['*',[Sequelize.fn("COUNT",Sequelize.col("products.id")),"productCount"]],
    raw:true,
    include : Products,
    separate:true,
    group: ['id']
}).then(result=>cb(null,result)).catch(err=>cb(err,null))
}

exports.addCat = (data,callback)=>{
    const categoryName = data.catName;
    const categoryDesc = data.catDesc;
    const imageUrl = data.catImage;
    Cat.create({
        categoryName,
        categoryDesc,
        imageUrl,
        }).then(result=>callback(null,result)).catch(err=>callback(err,null))
    }

exports.getCatName = (cb)=>{
    Cat.findAll({
        attributes:["id","categoryName"],
        raw:true
    }).then(res=>cb(null,res)).catch(err=>cb(err,null))
}

exports.deleteCat= (id,cb) =>{
Cat.findByPk(id)
.then(result=>{
    result.destroy()
    .then(result=>cb(null,result))

}).catch(err=>cb(err,null))
}