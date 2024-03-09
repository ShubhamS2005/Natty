const express=require("express");
const path=require("path");
const mongoose=require("mongoose");

const app=express();
const port=4000;

const mongoDB="mongodb://127.0.0.1:27017/ShopEra";
// connection made
mongoose.connect(mongoDB);

//static made
app.use("/static",express.static("static"));
app.use(express.urlencoded());

// view engine connected
app.set("view engine","pug");
app.set("views",path.join(__dirname,"views"));


// get requests
app.get("/",(req,res)=>{
    res.status(200).render("home.pug");
})

// get the routes
const userroute=require('./routes/userRoute');
app.use('/',userroute); 


// listening of port
app.listen(port,()=>{
    console.log(`server running at ${port}`);
})