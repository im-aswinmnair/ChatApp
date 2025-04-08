const express = require('express');
const router = express.Router();
const chatcontroller=require('../controller/chatcontroller')
const {authMiddleware}=require('../middleware/authmiddleware')
const image=require('../middleware/upload')

router.get("/profile",authMiddleware,chatcontroller.getprofile)
router.get("/chat",authMiddleware,chatcontroller.getchat)
router.get("/messages/:id", authMiddleware,chatcontroller.getmessage)
router.get("/getCurrentUser",authMiddleware,chatcontroller.getCurrentUser)

router.post("/profile", authMiddleware, image.single("image"), chatcontroller.postprofile)

module.exports = router;