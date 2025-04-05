var express = require('express');
var router = express.Router();
const authcontroller=require('../controller/authcontroller')
const { protectRouts } = require("../middleware/authmiddleware");



router.get("/",protectRouts,authcontroller.getsignup)
router.get("/login",protectRouts,authcontroller.loginget)
router.get("/verify-otp",protectRouts,authcontroller.getVerifyOtp);
router.get('/logout',authcontroller.logout)

router.post("/signup",protectRouts,authcontroller.postsignup)
router.post ('/verify-otp',protectRouts,authcontroller.postVerifyOtp)
router.post("/login",protectRouts,authcontroller.postlogin)




module.exports = router;
