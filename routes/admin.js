var express = require('express');
var router = express.Router();
var usersControl = require('../control/usersControl');
var authMiddle = require('../middlewares/authMiddle') ;
// var multer  = require('multer');
var {check,body} = require('express-validator/check')
var productControl = require('../control/productsControl');
var catControl = require('../control/catControl');
// Admin DashBoard Route

router.get('/', authMiddle , usersControl.getMainAdmin);

// Get Users Routes 

router.get('/adduser', authMiddle , usersControl.adduserPage);
router.get('/allusers', authMiddle ,usersControl.alluser);
router.get('/edituser/:id', authMiddle ,usersControl.getOneUser);
router.get('/edituser/:id/changepassword',authMiddle, usersControl.changePassword)
// Post users Listings
router.post('/addnewuser', authMiddle ,[
    // username must be an email
    check('firstname','Please Provide firstname ').not().isEmpty(),
    check('lastname','Please Provide lastname ').not().isEmpty(),
    check('email','Please Provide email ').isEmail(),
    body('password','Please Enter a password with only Numbers and text At least 5 characters ').isLength({min:5}),
    body('retypePassword').custom((value ,{req})=>{
        if(value !== req.body.password){
            throw new Error('Passwords Must Match ')
        }else{
            return true
        }
    }),
  ], usersControl.addUser);
router.post('/allusers',authMiddle,usersControl.searchForUsers)
router.post('/edituser/:id/update',authMiddle,[
    // username must be an email
    check('firstname','Please Provide firstname ').not().isEmpty(),
    check('lastname','Please Provide lastname ').not().isEmpty(),
    check('email','Please Provide email ').isEmail(),
  ],usersControl.updateUser)
router.post('/deleteuser/:id',authMiddle, usersControl.deleteUser);
router.post('/edituser/:id/changepassword/update' , authMiddle ,usersControl.updatePassword);
router.post('/addnewuser/emailcheck',usersControl.checkMail)
router.post('/addnewuser/emailcheckupdate/:id',usersControl.checkMailUpdate)
router.post('/edituser/:id/changeimage', authMiddle , usersControl.updateImage)

//get Products routes
router.get('/products',authMiddle,productControl.allProductsPage);
router.get('/products/add',authMiddle,productControl.addProduct);
// post Products route
router.post("/products/add",authMiddle,productControl.insertProduct);


// get Categories
router.get('/cat',authMiddle, catControl.allCatsPage);
router.get('/cat/add',authMiddle, catControl.addCat);

// post Cat
router.post('/cat/addcat',authMiddle,catControl.addCatDo)

//delete
router.post('/cat/:id',authMiddle,catControl.deleteCat);
module.exports = router;