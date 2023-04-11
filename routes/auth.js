const User=require('../model/user')
const express=require('express')
const {check}=require('express-validator')
const router=express.Router()

const authController=require("../controllers/auth")
router.put('/signup',[
    check("email").isEmail().withMessage("not valid email")
   .custom((value,{req})=>{
    return User.findOne({email:value}).then(userDoc=>{
        if(userDoc){
            return Promise.reject("email is already exists")
        }
    })
   }).normalizeEmail(),
   check("password").trim().isLength({min:5})  ,
   check("name").trim().not().isEmpty()

],authController.signup)
router.post("/login",authController.login)

module.exports=router