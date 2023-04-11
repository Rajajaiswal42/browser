// const jwt=require('jsonwebtoken')
// module.exports=(req,res,next)=>{
//  const AuthHeader=req.get(" Authorization")
//  if(!AuthHeader){
//     const error=new Error("no authenticated")
//     error.statuscode=401
//     throw error
//  }
//  const token=AuthHeader.split(' ')[1]
//  console.log(token)
//  let decodedToken;
//  try{
//   decodedToken=jwt.verify(token,"raja42")//NodejsRaja
//  }
//  catch(err){
//     err.statuscode=500
//     throw err
//  }
//  if(!decodedToken){
//     const error=new Error("no authoeizes")
//     error.statuscode=401
//     throw err

//  }
//  req.userId=decodedToken.userId
//  next()
// }

//sir code down
 const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token=req.query.token
  //console.log(token)
// console.log( req.query)
  // const authHeader = req.get('Authorization');
  // if (!authHeader) {
  //   const error = new Error('Not found headers.');
  //   error.statusCode = 401;
  //   throw error;
  // }
  // const token =  authHeader.split(' ')[1]// 
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'raja42');
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
