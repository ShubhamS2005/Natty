const User=require('../models/user');

const bcrypt=require('bcrypt');
const nodemailer=require('nodemailer');
const Randomstring=require('randomstring');
const config=require('../config/config');

// login
const loadlogin=async(req,res)=>{
    try {
       res.render("login.pug");
    } catch (error) {
        console.log(error.message);
    }
 
}
const loadsignup=async(req,res)=>{
    try {
       res.render("signup.pug");
    } catch (error) {
        console.log(error.message);
    }
 
}

const sendverifymail=async(name,email,user_id)=>{
    try {
        const transpoter=nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:465,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.passwordUser
            }
        });
        const mailoptions={
            from:config.emailUser,
            to:email,
            subject:'For Verification of ShopEra',
            html:'<p>Hii,'+name+', this mail is send to remind you to confirm your email,please click here to <a href="http://127.0.0.1:4000/verify?id='+user_id+'">verify</a> your email id.</p>'
        }
        transpoter.sendMail(mailoptions,function(error,info){
            if(error){
                console.log(error);
            }
            else{
                console.log("Email has been sent:- ",info.response);
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}
const verifymail=async(req,res)=>{
    try {
        const updateinfo=await User.updateOne({_id:req.query.id},{$set:{is_verified:1}});
        console.log(updateinfo);
        res.render("email-verified.pug");
    } catch (error) {
        console.log(error.message);
    }
}
const secrurepassword=async(password)=>{
    try{
        const passwordhash= await bcrypt.hash(password,10);
        return passwordhash;
    }catch(error) {
        console.log(error.message);
    }
}
// insert school
const insertschool=async(req,res)=>{
    try {
        const spassword=await secrurepassword(req.body.password)
        const user=new User({
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            country:req.body.country,
            state:req.body.state,
            password:spassword,
            is_admin:0
        })
        const userdata= await user.save();

        if(userdata){
            sendverifymail(req.body.name,req.body.email,userdata._id);
            res.render('signup.pug',{message:'Your form is submited please verify your email'});
        }
        else{
            res.render('signup.pug',{message:'Your form is not submited '});
        }
    } catch (error) {
        console.log(error.message);
    }
}
// forget password 
const loadforget=async(req,res)=>{
    try {
       res.render("forget.pug");
    } catch (error) {
        console.log(error.message);
    }
}
const verifyforget=async(req,res)=>{
    try {
        const email=req.body.email;
        const schoolcode=req.body.schoolcode;
        const schoolData=await School.findOne({schoolcode:schoolcode});
        
        if(schoolData){ 
            if(schoolData.email===email){
                if(schoolData.is_verified===0){
                    res.render('forget.pug',{message:'Your email is not verified please verify it'});
                }
                else{
                    const randomstring= Randomstring.generate();
                    const updateData=await School.updateOne({email:email},{$set:{token:randomstring}});
                    sendresetpasswordmail(schoolData.schoolcode,schoolData.email,randomstring);
                    res.render('forget.pug',{message:'please check your mail to reset your password'});
                }
                                      
            }
            else{
                res.render('forget.pug',{message:'Your email or schoolcode is incorrect'});
            }         
        }
        else{
            res.render('forget.pug',{message:'Your email or schoolcode is incorrect'});
        }
    }
    catch (error) {
        console.log(error.message);
    }
}
const forgetpasswordload=async(req,res)=>{
    try {
       const token=req.query.token;
       const tokendata=await School.findOne({token:token});
       if(tokendata){
        res.render('Forget-password.pug',{user_id:tokendata._id});
       }
       else{
            res.render('404.pug',{message:'Token Is Inavalid'})
       } 
    } catch (error) {
        console.log(error.message);
    }

}
const resetpassword=async(req,res)=>{
    try {
        const password=req.body.password;
        const user_id=req.body.user_id;
        const secrure_password=await secrurepassword(password);
        const updatedata= await School.findByIdAndUpdate({_id:user_id},{$set:{password:secrure_password,token:''}})
        res.redirect("/login");
    } catch (error) {
        console.log(error.message);
    }
}
const verifylogin=async(req,res)=>{
    try {
        const email=req.body.email;
        const password=req.body.password;
        const userData=await User.findOne({email:email});
        
        if(userData){         
            const passwordmatch=await bcrypt.compare(password,userData.password);
            if(passwordmatch){
                if(userData.is_verified===0){
                    res.render('login.pug',{message:'Your email is not verified'});
                }
                else{
                    req.session.user_id=userData._id;
                    res.redirect('/userhome');
                }
            }
            else{
                res.render('login.pug',{message:'Your email,schoolcode or password is incorect'});
            }  
        
                    
        }
        else{
            res.render('login.pug',{message:'Your email,schoolcode or password is incorrect'});
        }
    }
    catch (error) {
        console.log(error.message);
    }
}
// User home
const loadhome=async(req,res)=>{
    try {
        const userdata=await User.findById({_id:req.session.user_id});
       res.render("userhome.pug",{user:userdata});
    } catch (error) {
        console.log(error.message);
    }
 
}
module.exports={
    loadlogin,
    loadsignup,
    insertschool,
    verifymail,
    loadforget,
    verifyforget,
    forgetpasswordload,
    resetpassword,
    verifylogin,
    loadhome
};
