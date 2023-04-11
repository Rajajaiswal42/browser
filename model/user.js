const mongoose=require('mongoose')
const schema=mongoose.Schema
const UserSchema=new schema({
 email:{
    type:String,
    required:true
 },
 password:{
    type:String,
    required:true
 },
 name:{
    type:String,
    required:true
 },
 status:{
    type:String,
    default:"i am new"
 },
 posts:[{
      type:schema.Types.ObjectId,
      ref:"POST"
 }]



})
module.exports=mongoose.model('User',UserSchema)