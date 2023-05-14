// require('./config/connection')
// const express=require('express')
// const cors=require('cors')
// const User = require('./models/user')
// const userRoute = require('./Routers/userRoute')
// const app= express()
// const port=3000
// app.use(cors())
// app.use(express.urlencoded({extended:true}))
// app.use(express.json())


// app.use('/user',userRoute)
// // app.get('/',function(req,res){
// //     res.send('working')
// // }
// // )
// app.listen(port,()=>console.log(`Connected At :${port}`))




require("./config/connection");
const express = require("express");
const app = express();
const path =require('path')
const cors = require("cors");
const User = require("./models/users");
const userroute=require('./Routers/userRoute')
// const userroute=require('./Routers/userRouter')
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname,'public/')));

// app.use((req, res, next) => {
//     let pathFile = path.join(__dirname,"","public",'notFound.html')
//     res.sendFile(pathFile) 
//   });
// app.use(express.static('public'));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(express.static(__dirname+'public'))

app.use('/user',userroute)
// app.get('/home',function(req,res)
// {
//     let pathFile = path.join(__dirname,'public/home.html')
//     res.sendFile(pathFile)
//     // res.sendFile('public/index.html',{root:__dirname})1
// })
port=3000
app.listen(port,function()
{
    console.log(`listen At ${port}`);
})


