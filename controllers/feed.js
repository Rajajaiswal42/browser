const{validationResult, Result}=require("express-validator")
const mongoose=require("mongoose")
const Post=require("../model/post.js")
const User=require("../model/user")
const fs=require('fs')
const path=require('path')
const socket=require("../socket.js")


exports.getPosts=async(req,res,next)=>{
   const currentPage=req.query.page||1
   const perpage=2
   let totalItems;
   try{
 const count= await Post.find().countDocuments().sort({createdAT: - 1 })
 totalItems=count
     const result=await Post.find().populate('creator')
     .skip((currentPage-1)*perpage)
     .limit(perpage)
        res.status(200).json({
            messsage:"fetched posts",
            posts:result,
            totalItems:totalItems
        })
    }
   catch(err){
    if(!err.statusCode==500){
        err.statusCode=500
     }
     next(err)
   }

    }

 exports.createPosts=async(req,res,next)=>{
    if(!req.file){
        const error= new Error("no image provided")
        error.statusCode=422
        throw error
    }
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        const error= new Error("validation error")
        error.statusCode=422
        throw error
  
    } let creator;
    const title=req.body.title
    const content=req.body.content
    const imageURL=req.file.path.replace('\\','/')
    const post=new Post({
        title:title,
        content:content,
        imageurl:imageURL,
        creator:req.userId
    
    })
    socket.getIO().emit('posts',{
        action:"create",
        post:post
    })
    try{
    await  post.save()
   
    const user= await  User.findById(req.userId)
   // creator=user


    user.posts.push(post) 
    await user.save();
    res.status(201).json({
        message:'post created successfully',
        post:post,
        creator:{_id:user._id,name:user.name}
    }     
    )
}
catch(err){
    if(!err.statusCode==500){
        err.statusCode=500
     }
     next(err)
}

}  
  
 
exports.getPOST=async(req,res,next)=>{
    const postId=req.params.postId
    const post = await Post.findById(postId)
    try{
        if(!post){
            const error=new Error('could not found posts')
            error.statusCode=404
            throw error
        }
        res.status(200).json({
                 message:"fetched posts",
                 post:post
        })
    }
    catch(err){
        if(!err.statusCode==500){
            err.statusCode=500
         }
         next(err)
    }
}
exports.updatePost=async(req,res,next)=>{
 const postId=req.params.postId
 const errors=validationResult(req)
 if(!errors.isEmpty()){
     const error= new Error("validation error")
     error.statusCode=422
     throw error

 }
 const title=req.body.title
 const content=req.body.content
 let imageurl=req.body.image
 if(req.file){
    imageurl=req.file.path.replace('\\','/')
 }
 if(!imageurl){
    const error= new Error("no image provided")
        error.statusCode=422
        throw error
 }
 const post=  await Post.findById(postId)
  try{
    if(!post){
        const error=new Error('could not found posts')
        error.statusCode=404
        throw error
    }
    if(imageurl!==post.imageurl){
        clearImage(post.imageurl)
    }
    if(post.creator.toString()!==req.userId){
        const error=new Error('not authorised user')
        error.statusCode=404
        throw error   
    }
    post.title=title
    post.content=content
    post.imageurl=imageurl
    const data=await post.save()
    io.getIO().emit('posts', { action: 'update', post: data });
    res.status(200).json({
            message:'products updated',
            post:data
        })
    }
  catch(err){
    if(!err.statusCode==500){
        err.statusCode=500
     }
     next(err)
  } 
}


const clearImage=filePath=>{
    filePath=path.join(__dirname,'..',filePath)
    fs.unlink(filePath,err=>{
        console.log(err)
    })
}
exports.delePost=async(req,res,next)=>{
 const postId=req.params.postId
 const post=  await Post.findById(postId)
 try{
  if(!post){
    const error=new Error('could not found posts')
    error.statusCode=404
    throw error
  }
  if(post.creator.toString()!==req.userId){
    const error=new Error('not authorised user')
    error.statusCode=404
    throw error    
}

  clearImage(post.imageurl)
const data=  await Post.findByIdAndRemove(postId)
   const user=await User.findById(req.userId)
        user.posts.pull(postId)
        await user.save()
        socket.getIO.emit('posts',{action:"delete",post:postId})
        res.status(200).json({
       messgae:"post deleted"

        })
    }
    catch(err){
    if(!err.statusCode==500){
        err.statusCode=500
     }
     next(err)
    }


}