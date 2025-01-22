const mongoose = require('mongoose')

const BookingSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    riderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required: true
    },
    subscriberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    BakeryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    quantity: {
        type: Number,
        required: true
    },
    availabilty: {
        type: String,
        required: true
    },
    days: {
        type: String,
        // required: true
    },
    bookingDropImg: {
        type: String
    },
    Location:{
        type:{
            type:String,
            // required:true
        },
        coordinates:[]
    },
    orderStatus:{
        type:String,
        required:true,
        enum: ["Pending", "Ready", "Start", "Pick", "Drop"],
        default: "Pending"
    },
    riderStatus:{
        type: String,
        enum:["Pending", "Accepted"],
        default: "Pending"
    },
    acceptedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    rejectedBy: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    TotalPrice:{
        type: String,
        required: true
    },
 

})

module.exports = mongoose.model('Booking',BookingSchema)