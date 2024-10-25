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
    productdetail: {
        type: String,
        required: true
    },
    bookingDropImg: {
        type: String
    },
    status:{
        type:String,
        required:true,
        enum: ["Pending", "Ready", "Start", "Pick", "Drop"],
        default: "Pending"
    },
    
})

module.exports = mongoose.model('Booking',BookingSchema)