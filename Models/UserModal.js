const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    address:{
        type:String,
    },
    phoneNumber:{
        type:String,
    },
    DOB:{
        type:String,
    },
    city:{
        type:String,
    },
    state:{
        type:String,
    },
    zipCode:{
        type:String,
    },
    bakeryName:{
        type:String,
    },
    bakeryWebsite:{
        type:String,
    },
    businessHours:{
        type:String,
    },
    categories:{
        type:Array,
    },
    Location:{
        type:{
            type:String,
            // required:true
        },
        coordinates:[]
    },
    type:{
        type:String,
        enum: ["Owner", "Subscriber", "Rider"],
        required:true
    },
    profilePic: {
        type: String,
    }
    
})

module.exports = mongoose.model('User',UserSchema)