const mongoose = require("mongoose");

const ContactSchema=new mongoose.Schema({
    name:{type:String , required:false},
    phoneNumber:{type:Number , required:false},
    email:{type:String , required:false},
    weatherdata:{type:String , required:false},
    message:{type:String , required:false},
});

module.exports=mongoose.model("Contact",ContactSchema);