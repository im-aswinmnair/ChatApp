const mongoose=require('mongoose')


const userschema=new mongoose.Schema({
    username:{
        type:String,
        require:true,
        trim:true
    },
    email:{
        type:String,
        require:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        require:true,
        trim:true
    },
    otp:{
        type:String
    },
    otpExpires: {
        type:Date
    }
    , 
    verified: { 
        type: Boolean, 
        default: false },
    bio:{
        type:String,
        require:true

    },
    image:{
        type: String, 
        default: "images/default-blog.jpg",
    }
},
{ timestamps: true }
)



module.exports=mongoose.model("User",userschema)