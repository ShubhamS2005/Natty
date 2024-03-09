const express=require("express");
const session=require('express-session')
const config=require('../config/config')
const user_route=express();

user_route.set('view engine','pug');
user_route.set('views','./views');

const bodyparser=require('body-parser') ;
user_route.use(bodyparser.json());
user_route.use(bodyparser.urlencoded({extended:true}));
user_route.use(session({secret:config.sessionSecret}));

// Controllers Connected 
const userController=require("../controllers/usercontroller");

// Middleware Connected
const auth=require('../middleware/auth')

// User
// Get Requests
user_route.get('/login',auth.islogout,userController.loadlogin);
user_route.get('/verify',auth.islogout,userController.verifymail);
user_route.get('/signup',auth.islogout,userController.loadsignup);
user_route.get('/forget',userController.loadforget); 
user_route.get('/userhome',auth.islogin,userController.loadhome); 


// post requests
user_route.post('/signup',userController.insertschool);
user_route.post('/login',userController.verifylogin);
user_route.post('/forget',userController.verifyforget);
user_route.post('/Forget-password',userController.resetpassword);

// export
module.exports=user_route;