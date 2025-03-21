var express = require('express');
var router = express.Router();
const chatcontroller=require('../conroller/chatcontroller')
const {authMiddleware}=require('../middleware/authmiddleware')
const image=require('../middleware/upload')





router.get("/profile",authMiddleware,chatcontroller.getprofile)
router.get("/chat",authMiddleware,chatcontroller.getchat)
router.get("/messages/:id", authMiddleware,chatcontroller.getmessage)
router.get('/getCurrentUser',authMiddleware,chatcontroller.getCurrentUser)





router.post("/profile",image.single("image"),authMiddleware,chatcontroller.postprofile)











module.exports = router;