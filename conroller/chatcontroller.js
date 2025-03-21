const User=require('../models/user')
const Message=require('../models/chat')
const jwt = require("jsonwebtoken");
const user = require('../models/user');

exports.getprofile = async (req, res) => {
    try {

        const decoded=jwt.verify(req.cookies.token, process.env.SECRET_KEY);
        const userId =decoded.id;

  
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found.");
        }

        if (user.file && user.username && user.bio) {
            return res.render("chatlist",{ user: user });
        }

        
      return  res.render("profile", { user: user });
    } catch (error) {
    
        res.status(500).render("error", { message: "Error retrieving profile." });
    }
};





exports.postprofile = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
       

        const decoded=jwt.verify(req.cookies.token, process.env.SECRET_KEY);
        const userId =decoded.id;

       
        const user = await User.findById(userId);
      
        if (!user) {
            return res.status(404).send("No user found with the provided ID.");
        }


        if (req.file) {
            user.image = req.file.filename;
        }
        
        user.username = req.body.username;
        user.bio = req.body.bio;

        await user.save();

        res.redirect(`/Chat/chat`);
    } catch (error) {
   
        res.status(500).render("error", { message: "Error updating profile." });
    }
};











exports.getchat = async (req, res) => {
    try {
        let userId = null;

       
        if (req.cookies.token) {
            try {
                const decoded = jwt.verify(req.cookies.token, process.env.SECRET_KEY);
                userId = decoded.id;
            } catch (error) {
                console.error("Invalid Token:", error);
                return res.redirect("/login");
            }
        } else if (req.user) {
            userId = req.user._id;
        }

        
        if (!userId) {
            return res.redirect("/login");
        }

        
        const users = await User.find({ _id: { $ne: userId } }).select("_id username image");

        res.render("chatlist", { users, userId });
        console.log("images:",users.image);
        

    } catch (error) {
       
        res.status(500).render("error", { message: "Error loading chat." });
    }
};





exports.getCurrentUser =async (req, res) => {
       try {
             if (!req.cookies.token) {
                 return res.status(401).json({ error: "Unauthorized: No token found" });
             }
     
             const decoded = jwt.verify(req.cookies.token, process.env.SECRET_KEY);
             const user=await User.findById(decoded.id).select("username email bio image");


             return res.json({ userId: decoded.id, 
                username: user.username, 
                email: user.email, 
                bio: user.bio, 
                image: user.image } );  
         } catch (error) {
             console.error("Error fetching current user:", error);
             return res.status(401).json({ error: "Invalid token" });
         }
};




exports.getmessage=async(req,res)=>{
    try {
          
           const decoded = jwt.verify(req.cookies.token, process.env.SECRET_KEY);

       
            const userId = decoded.id; 
            const otherUserId = req.params.id;

         
    
            const messages = await Message.find({
                $or: [
                    { senderId: userId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: userId },
                ],
            }).sort({ createdAt: 1 });
    
            res.json(messages);
        } catch (error) {
            console.error("Error fetching messages:", error);
            res.status(500).send("Error fetching messages.");
        }
}



















