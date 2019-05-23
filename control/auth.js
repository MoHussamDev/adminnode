var User = require('../models/user');
var bcrypt = require('bcryptjs');



exports.login= (req, res, next) =>{
    res.render('adminDashboard/login');
}

exports.isLogin= (req, res, next) => {
    var email = req.body.email
    var password = req.body.password

    User.findOne({ where: {email: email}})
    .then((resu)=>{
        var retriveMail = resu.dataValues.email
        var retrivePass = resu.dataValues.password
        bcrypt.compare(password, retrivePass).then((result) => {
           if(result){
           req.session.isLoggedIn = true;
           req.session.userId = resu.id;
           res.redirect("/admin");
           }else{
            res.redirect("/auth/login");
           }
        })}).catch(err=>res.redirect("/auth/login"));
    }