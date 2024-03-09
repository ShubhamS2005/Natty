const mongoose = require("mongoose");

const userScheema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    token:{
        type: String,
        default:''
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    is_verified: {
        type:Number,
        default:0
    },
    is_admin: {
        type: Number,
        required: true
    },
    
});

module.exports=mongoose.model('User',userScheema);
