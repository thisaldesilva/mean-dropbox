let jwt = require('jsonwebtoken');
const config = require('./config.js');


//this function is to very the JWT token send via each request.
//this will be used as a middle ware in get/post methods on file requests
let checkToken = () =>{ return (req, res, next) => {

  //first get the entire JWT token (header/payload/signature)
  let token = req.headers['x-access-token'] || req.headers['authorization']; 
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
    console.log("The token starts from bearer --- ", token);
  }

  //if the token exist then verify
  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        //attach the decoded into the reqest body
        (req.decoded = decoded);
        next();
        
      }
    });
  } else {
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
}};

module.exports = {
  checkToken: checkToken
}