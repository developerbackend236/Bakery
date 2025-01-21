const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    bakeryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number,
        required: true,
        default: 0
    },
    productDescp: {
        type: String,
        required: true
    },
    flavor:{
        type: String,
        required: true
    },
    chooseCategory: {
        type: String,
        required: true
    },
    stockQuantity: {
        type: Number,
        required: true
    },
    productImage: {
        type: String,
        required: true
    },

},{ timestamps: true })

module.exports = mongoose.model('Product', ProductSchema)