const mongoose=require('mongoose')

const chatschema=new mongoose.Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true,
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    room: {
        type: String,
        
    },
   
    message:{
        type:String,
        required:true,
        trim: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
      },
})


module.exports = mongoose.model('Chat', chatschema);