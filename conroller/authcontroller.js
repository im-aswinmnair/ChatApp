const User=require('../models/user')
const bcrypt = require("bcrypt");
const transporter=require('../confiq/email')
const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const { error } = require('console');
const jwt=require('jsonwebtoken')

const SECRET_KEY = process.env.SECRET_KEY || "yourSecretKey";



exports.getsignup=(req,res)=>{
    res.render("signup")
}
exports.postsignup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            if (existingUser.verified) {
                return res.render("signup", { error: "Email already in use" });
            } else {
                
                const otp = otpGenerator.generate(4, { 
                    digits: true, 
                    upperCase: false, 
                    specialChars: false, 
                    alphabets: false 
                });

                const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
                existingUser.otp = hashedOtp;
                existingUser.otpExpires = Date.now() + 300000; 

                await existingUser.save();

       
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: "Your OTP Code",
                    text: `Your OTP is ${otp}. It will expire in 5 minutes.`
                };

                await transporter.sendMail(mailOptions);
                return res.render("otp", { email, message: "New OTP sent. Please verify." });
            }
        }

        const otp = otpGenerator.generate(4, { 
            digits: true, 
            upperCase: false, 
            specialChars: false, 
            alphabets: false 
        });

        const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

        const newUser = new User({
            username,
            email,
            password: null,
            otp: hashedOtp,
            otpExpires: Date.now() + 300000, 
            verified: false
        });

        await newUser.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP is ${otp}. It will expire in 5 minutes.`
        };

        await transporter.sendMail(mailOptions);
        res.render("otp", { email });

    } catch (err) {
        console.log(err);
        res.status(500).render("error", { message: "Error signing up" });
    }
};


exports.getVerifyOtp = (req, res) => {
    res.render("otp", { email: req.query.email });
};



exports.postVerifyOtp = async (req, res) => {
    try {
        const { email, otp, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.render("otp", { error: "User not found", email });
        }

        if (Date.now() > user.otpExpires) {
            return res.render("otp", { error: "OTP expired", email });
        }

        const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

        if (hashedOtp !== user.otp) {
            return res.render("otp", { error: "Invalid OTP", email });
        }

 
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.verified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.redirect("/login");

    } catch (err) {
        
        res.status(500).render("error", { message: "Error verifying OTP" });
    }
};


exports.loginget=(req,res)=>{
        res.render("login")
}



exports.postlogin=async(req,res)=>{
    try{
        const{email,password}=req.body;

        const user=await User.findOne({email})
      
        if(!user){
          return  res.status(500).render("login",{error:"User not founded"})
        }
        const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
       
        return res.render("login", { error: "Invalid  password" });
      }
        
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });

      res.cookie("token", token, { httpOnly: true });


    //   if (user.file && user.username && user.bio) {
    //     return res.redirect("/Chat/chat");
    // }


      return   res.redirect(`/Chat/profile`);


    }catch(error){
      
        res.status(500).render("error",{message:"Login fail"})
    }
}




exports.logout=(req,res)=>{
    res.clearCookie("token"); 
    res.redirect("/login");
}