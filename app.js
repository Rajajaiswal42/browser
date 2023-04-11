const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const mongoose=require('mongoose')
const path=require("path")
const multer=require('multer')
const {v4:uuidv4}=require('uuid')
const cors=require('cors')
const graphqlHttp=require("express-graphql").graphqlHTTP
// const feedRoutes=require('./routes/feed')
// const authRoutes=require('./routes/auth')
const graphqlSchema=require("./graphql/schema")
const graphqlresolver=require("./graphql/resolver")


 const fileStorage=multer.diskStorage({
   destination:(req,file,cb)=>{
      cb(null,'images')
   },
   filename: (req, file, cb) => {
      cb(null, uuidv4() + '-' + file.originalname);
    },

 })
 const filefilter=(req,file,cb)=>{
  if(
    file.mimetype==='image/png'|| file.mimetype==='image/jpg'|| file.mimetype==='image/jpeg'
  ){
   cb(null,true)
  }
  cb(null,false)
 }


app.use('/images',express.static(path.join(__dirname,'images')))

app.use(bodyParser.json())
app.use(multer({storage:fileStorage,fileFilter:filefilter}).single('image'))

app.use(cors())

app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader(
     'Access-Control-Allow-Methods',
     'OPTIONS, GET, POST, PUT, PATCH, DELETE'
   );
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
   next();
 });


app.use("/graphql",graphqlHttp({
  schema:graphqlSchema,
  rootValue:graphqlresolver ,
  graphiql:true,
}))



 
// app.use('/feed',feedRoutes)
// app.use('/auth',authRoutes)
app.use((error,req,res,next)=>{
 console.log(error)
 const status=error.statusCode||500
 const message=error.message
 const data=error.data
 res.status(status).json({
   message:message,
   data:data
 })

})

mongoose.connect("mongodb+srv://rajajaiswal:raja7484%40@cluster0.m7matrs.mongodb.net/reactAPP")
.then(data=>{
  app.listen(8080)
  
})
.catch(err=>console.log(err))



/*        const server = app.listen(8080);
        const io = require('socket.io')(server, {
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"]
            }
        });*/