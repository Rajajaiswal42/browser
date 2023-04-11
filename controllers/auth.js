const User=require("../model/user")
const{validationResult}=require('express-validator')
const brcypt=require('bcrypt')
const jwt=require('jsonwebtoken')
 
exports.signup=async(req,res,next)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        const error= new Error("validation error")
        error.statusCode=422
        error.data=errors.array()
        throw error
  
    }
    const email=req.body.email
    const password=req.body.password
    const name=req.body.name
   try{ 
    const hashedPass= await  brcypt.hash(password,12)
        const user=new User({
            email:email,
            password:hashedPass,
            name:name,
           
        })
        const data=   await  user.save() 
       res.status(201).json({
        message:"user created",
        userId:data._id
       })
   }
    catch(err){
        if(!err.statusCode==500){
            err.statusCode=500
         }
         next(err)
    }


}
exports.login=async(req,res,next)=>{
    const email=req.body.email
    const password=req.body.password
    let lodedUser;

   try{ 
    const user= await User.findOne({email:email})
 
    if(!user){
        const error=new Error('no user found')
        error.statusCode=401
        throw error
    }
    lodedUser=user
 const isEqual=  await brcypt.compare(password,user.password)
    if(!isEqual){
        const error=new Error('wrong password')
        error.statusCode=101
        throw error
    }
  const token=  jwt.sign({
        email:lodedUser.email,
        userId:lodedUser._id.toString()
    },'raja42',{expiresIn:'2h'})
    res.status(200).json({
        message:"logged in",
        token:token,
        userId:lodedUser._id.toString()
    })

}
catch(err){
    if(!err.statusCode==500){
        err.statusCode=500
     }
     next(err)

   }
}

