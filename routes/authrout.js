var express = require('express');
var router = express.Router();
const authcontroller=require('../conroller/authcontroller')
const { requireGuest } = require("../middleware/authmiddleware");



router.get("/",requireGuest,authcontroller.getsignup)
router.get("/login",requireGuest,authcontroller.loginget)
router.get("/verify-otp", requireGuest,authcontroller.getVerifyOtp);
router.get('/logout',authcontroller.logout)

router.post("/signup",requireGuest,authcontroller.postsignup)
router.post ('/verify-otp',requireGuest,authcontroller.postVerifyOtp)
router.post("/login",requireGuest,authcontroller.postlogin)




module.exports = router;
