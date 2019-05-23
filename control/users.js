const User = require('../models/user');
const bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const  fileController = require('../util/file');

// find All users 
exports.getAllUsers = (callback) => {
    User.findAll().then((usersAll)=>{
        callback(null,usersAll);
    }).catch(err=>callback(err,null))
}

//find User
exports.findOneUser = (userId,callback)=>{
User.findAll({where:{
    id: userId,

}, raw: true}).then((result)=>{
    var reso =result[0]
    const userDat = {
        id:reso.id,
        firstname:reso.firstname,
        lastname:reso.lastname,
        email:reso.email,
        image:reso.image,
       
    }

    return callback(null,userDat);
}
).catch(err=>callback(err,null))
}
exports.searchForUsers = (username,cb)=>{
    User.findAll(
        {
         where:{
        [Op.or]:[
            {
            firstname:{
                [Op.like] : username+'%'
                      }
            },
            {
                lastname:{
                    [Op.like] : username+'%'
                          }
                },
    ]
        }
    }
 ).then(result=>cb(null,result)).catch(err=>cb(err,null))
}

//add user
exports.addUser = (data,file,callback)=>{

    const firstname = data.firstname;
    const lastname = data.lastname;
    const email = data.email;
    const password = data.password;
    const hash = bcrypt.hashSync(password, salt);
    const image = file
    User.create({
            firstname,
            lastname,
            email,
            password:hash,
            image

        }).then(result=>callback(null,result)).catch(err=>callback(err,null))
    }


exports.updateUser = (iid,data,cb)=>{
User.findByPk(iid).then(user=>{
    user.firstname = data.firstName
    user.lastname = data.lastName
    user.email = data.email
    user.save()
        .then(res=>cb(null,res))
        .catch(err=>cb(err,null))


}).catch(err=>cb(err,null))


}

exports.deleteUser = (id,cb)=>{
    User.findByPk(id).then(im=>fileController.deleteFile(im.image)).catch(err=>console.log(err))
    User.findByPk(id).then(user=>{
    user.destroy()
    .then(result=>{
        cb(null,result)
         }
        )
    .catch(err=>cb(err,null))
    }).catch(err=>cb(err,null));
}
exports.checkOldPassword=(id,old,cb)=>{
User.findByPk(id).then(result=>{
    bcrypt.compare(old, result.password, function(err, res) {
        if(err){
            cb(err,res);
        }
        cb(null,res);
    });
})
}
exports.updateUserPassword = (id,password,cb)=>{
User.findByPk(id).then(user=>{
    user.password = bcrypt.hashSync(password, salt);
    user.save().then(result=>cb(null,result)).catch(err=>cb(err,null))
}).catch(err=>cb(err,null));
}
exports.checkMailExist=(e,cb) =>{
User.count({
    where:{email:e}
}).then( count=>{
    if (count != 0) {
        return cb(null,true);
      }
       return cb(null,false)

 }
).catch(err=>cb(err,null))
}
exports.checkMailExistToUpdate=(e,cb) =>{
User.count({
    where:{email:e}
}).then( count=>{
    if (count != 0) {
        return cb(null,true);
      }
       return cb(null,false)

 }
).catch(err=>cb(err,null))
}

exports.ifMailEqualMail = (mail, id , cb)=>{
    console.log(id)
User.findByPk(id).then(result=>{
    if(result.email === mail){
        cb(null,true)
    }else{
        cb(null,false)

    }

})
}

exports.updateImageUrl = (id,imagePath,cb)=>{
    User.findByPk(id).then(im=>fileController.deleteFile(im.image)).catch(err=>console.log(err))
    User.findByPk(id).then(result=>{
    result.image = imagePath;
    result.save().then(result=>cb(null,result)).catch(err=>cb(err,null));
    }).catch(err=>cb(err,null))
}
