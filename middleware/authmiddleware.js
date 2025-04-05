const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY || "mysecretKey";

exports.authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    

    if (!token) {
       
        return res.redirect("/");
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
      
        next();
    } catch (error) {
       
        res.clearCookie("token");
        res.redirect("/");
    }
};

exports.protectRouts = (req, res, next) => {
    const token = req.cookies.token;
   
    if (token) {
        try {
             jwt.verify(token, SECRET_KEY);

            return res.redirect(`/chat`);
        } catch (error) {
            console.error("Invalid token for guest:", error.message);
        }
    }

  
    next();
};