var User = require('../models/user');

module.exports.getToken =  (headers)=> {
    if (headers && headers.authorization) {
      var parted = headers.authorization.split(' ');
      if (parted.length === 2) {
        return parted[1];
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  
module.exports.isAuthorized =  (token,role, callback)=> {
  User.findOne({jwt: token}, function(err, user) {
    if (err) {
      callback(undefined, true) ;
    }
    if (user) {
      if (user.role === role){
        callback(true, undefined);
        }else{
          callback(undefined, true) ;
        }
    } 
});
  
};
