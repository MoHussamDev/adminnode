const productModel = require('../control/products');
const catModel = require('../control/cat');
const {validationResult} = require('express-validator/check')

exports.allProductsPage = (req, res,next)=>{
    productModel.getProducts((err,result)=>{
res.render('adminDashboard/pages/allProducts',{user:req.user,productsAll:result,productsFlash: req.flash('productsFlash') })
    })
}

exports.addProduct = (req,res,next)=>{
    catModel.getCatName((err,result)=>{
    res.render('adminDashboard/pages/addProduct',{user:req.user,cats:result });
})
}
exports.insertProduct = (req,res,next)=>{
    productModel.insertProduct(req.user,req.body,req.file ? req.file.path : null,(err,result)=>{
        req.flash('productsFlash',"Product Succefully Added")
        res.redirect('/admin/products',);
    })

  }