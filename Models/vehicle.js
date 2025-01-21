const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
    riderId:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    make:{
        type: String,
        required: true,
    },
    model:{
        type: String,
        required: true
    },
    vehicleNumber:{
        type: String,
        required: true,
    },
    riderLisence:{
        type: String,
        required: true
    }
}, { timestamps: true });

const vehicleModel = mongoose.model('vehicle', vehicleSchema);
module.exports = vehicleModel;