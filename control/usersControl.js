const User = require('../models/user');
const userControl = require('../control/users');
const {validationResult} = require('express-validator/check')

var dummy = {
id:'1',
 firstname:'mohamed',
 image:'/images/avatar.jpg'
}


exports.getMainAdmin = (req, res, next) => {
    if(req.user){

        res.render('adminDashboard/pages/main',{user:req.user});
    }else{

        res.render('adminDashboard/pages/main',{user:dummy});
    }

}

exports.adduserPage = (req, res, next) => {
    if(req.user){

        res.render('adminDashboard/pages/adduser',{user:req.user});
    }else{
        res.render('adminDashboard/pages/adduser',{user:dummy});

    }
}
exports.alluser = (req, res, next) => {
    userControl.getAllUsers((err,result)=>{
        if(err){
            console.log(err)
        }
        if(req.user){

            res.render('adminDashboard/pages/allUser',{usersAll:result, flashAll : req.flash('mainFlash') , user:req.user});
        }else{

            res.render('adminDashboard/pages/allUser',{usersAll:result, flashAll : req.flash('mainFlash') , user:dummy});
        }

    })
}
exports.getOneUser = (req,res,next) =>{
    var theUser = req.params.id

    userControl.findOneUser(theUser,(err,result)=>{
        if(req.user){
        res.render('adminDashboard/pages/editUser',{userData:result,flash : req.flash('messages'), user:req.user});
    }else{
        res.render('adminDashboard/pages/editUser',{userData:result ,flash : req.flash('messages'), user:dummy});
    }
    })
}


exports.logout = (req, res, next) => {
    req.session.destroy(err=>console.log(err));
    res.redirect('/')
}

exports.addUser = (req,res,next)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
    res.status(422).render('adminDashboard/pages/adduser',{errorMessage : errors.array()[0].msg});
    }else {
        var image = req.file
        userControl.addUser(req.body,image ? image.path : null , (err,result)=>{
            req.flash('mainFlash',"User Succefully Added")
            res.redirect('/admin/allusers');
        })
    }

}
exports.searchForUsers = (req,res,next)=>{
userControl.searchForUsers(req.body.nameSearch,(err,result)=>{
    if(err){
     return res.send(err);
    }
    res.render('adminDashboard/pages/allUser',{usersAll:result,user:req.user})

})
}
exports.updateUser =(req,res,next)=> {
    var id =req.params.id;
    const errors = validationResult(req);
        if (!errors.isEmpty()){
            userControl.findOneUser(id,(err,result)=>{
                res.render('adminDashboard/pages/editUser', {userData:result,
                    errorMessage : errors.array()[0].msg, }
            )
        })

        } else {
            var firstName =req.body.firstname;
            var lastName =req.body.lastname;
            var email =req.body.email;
            var data = {firstName,lastName,email};
            userControl.updateUser(id,data,(err,result)=>{
                if(err){
                console.log(err)
            }
            req.flash('mainFlash', "User Succesfully Updated")
            res.redirect('/admin/allusers');
        });
    }
    }
exports.changePassword = (req,res,next)=>{
    var id = req.params.id
    res.render('adminDashboard/pages/changePassword', {user:req.user});
}

exports.deleteUser = (req,res,next)=>{
    var id = req.params.id
    userControl.deleteUser(id,(err,result)=>{
        if(err){
            res.send(err);
        }
        req.flash('mainFlash', "User Deleted Successfully")
        res.redirect('/admin/allusers')
    })

}
exports.updatePassword = (req , res , next)=>{
var id = req.params.id
var oldPassword = req.body.oldPassword
var newPassword = req.body.newPassword
//check Password
userControl.checkOldPassword(id,oldPassword,(err,result)=>{
if(result){
    userControl.updateUserPassword(id,newPassword,(err,result)=>{
        if(err){res.send(err)}
        req.flash('messages','password Successfully Updated');
        res.redirect(`/admin/edituser/${id}`)
    })
}else{
    res.render('adminDashboard/pages/changePassword',{errorMessage:"wrong Password "})
}
})
}

exports.checkMail = (req,res,next)=>{
    var email = req.body.email;
    userControl.checkMailExist(email,(err,result)=>{
        if(err){
            console.log(err);
        }
        if(result){
            return res.status(200).send('false');
        }else{
            return res.status(200).send('true');  
        }

    })
}
exports.checkMailUpdate=(req,res,next)=>{
    var id =req.params.id
    var email = req.body.email;
    userControl.ifMailEqualMail(email,id,(err,isMail)=>{
        if(err) console.log(err);
        if(isMail){
            return res.status(200).send('true');
        }else{
            userControl.checkMailExist(email,(err,result)=>{
                if(err){
                    console.log(err);
                }
                if(result){
                    return res.status(200).send('false');
                }else{
                    return res.status(200).send('true');
                }

            })
        }
    })
}
exports.updateImage=(req,res,next)=>{
    var image = req.file.path
    var id = req.params.id
    userControl.updateImageUrl(id,image,(err,updated)=>{
        if(err) console.log(err)
        req.flash('messages', "Display Image Successfully Updated")
        res.redirect('/admin/edituser/'+ id)
    })
}