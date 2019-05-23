const Cat = require('../models/categoryModel');
const catModel = require('../control/cat');
const {validationResult} = require('express-validator/check')

exports.allCatsPage = (req, res,next)=>{
    catModel.getCats((err,result)=>{
        if(err){console.log(err)}
        // console.log(result)
        res.render('adminDashboard/pages/allcategories',{user:req.user,catAll:result,catMesg : req.flash('catMsg')})

    })

}
exports.addCat = (req,res,next)=>{

    res.render('adminDashboard/pages/addCategory',{user:req.user});
}
exports.addCatDo=(req,res,next)=>{

    const data = {
        catName : req.body.catName,
        catDesc :req.body.catDesc,
        catImage:req.file ? req.file.path : null
    }
   catModel.addCat(data,(err,result)=>{
       if(err){res.send(err)};
       req.flash('catMsg','Category Succefully Added')
       res.redirect('/admin/cat')
   })
}
exports.deleteCat=(req,res,next)=>{
    var catId = req.params.id
catModel.deleteCat(catId,(err,result)=>{
    if (err) console.log(err);
    req.flash('catMsg','Category Succefully deleted')
    res.redirect('/admin/cat')
})
}