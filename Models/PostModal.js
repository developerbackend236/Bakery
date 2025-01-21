const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    postCreatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    PostImage:{
        type: String,
    },
    caption:{
        type: String,
    },
    PostLikes: [
        {
             
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            
        },
    ],
    PostComment: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            comment: {
                type:String
            }
        },
    ],
    PostShare: [
        {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
        },
    ],
    

 

},{
    timestamps: true
})

module.exports = mongoose.model('Post',PostSchema)