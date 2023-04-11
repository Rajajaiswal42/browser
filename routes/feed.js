const express=require('express')
const {check}=require('express-validator')
const isAuth=require("../middleware/IsAuth")

const router=express.Router()
const feedController=require('../controllers/feed')
//feed/posts
router.get('/posts',isAuth,feedController.getPosts)
router.post('/post',[
check('title').trim().isLength({min:5}),
check("content").trim().isLength({min:5})
],isAuth,
feedController.createPosts)
router.get('/POST/:postId',isAuth,feedController.getPOST)
router.put('/POST/:postId',[
    check('title').trim().isLength({min:5}),
   check("content").trim().isLength({min:5})
],isAuth,feedController.updatePost)
router.delete('/POST/:postId',isAuth,feedController.delePost)
module.exports=router