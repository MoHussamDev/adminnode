const fs = require('fs');

exports.deleteFile = (filePath)=>{
    fs. unlink(filePath,(err,result)=>{
        if (err){
            throw (err);
        }
    })
}

