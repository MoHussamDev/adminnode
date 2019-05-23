const userControl = require('../control/users')
module.exports = (req,res,next) => {
    if(!req.session.isLoggedIn){
        return res.redirect('/auth/login');
    }else{
        userControl.findOneUser(req.session.userId,(err,result)=>{
            req.user = result
            next();

        })
    }

}