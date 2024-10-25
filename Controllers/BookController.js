const Product = require('../Models/ProductModal.js')
const Book = require('../Models/BookModal.js')
const User = require('../Models/UserModal.js')

class BookController{

    static ProductBooking = async (req, res) => {
        const productId = req.params.id
        const { availabilty, days, productdetail, quantity } = req.body

        try {
            if(req.user.type !== 'Subscriber'){
                return res.status(200).json({
                    success: false,
                    message: "You aren't eligible for book this product."
                })
            }
            const ProductExist = await Product.findById(productId)
 
            if(!ProductExist){
                return res.status(200).json({
                    success: false,
                    message: "Product doesn't exist."
                })
            }
            const createBooking = new Book({
                productId,
                quantity,
                availabilty,
                days: (availabilty !== "daily" ? days : ""),
                productdetail,
                subscriberId: req.user._id
            })
            await createBooking.save()
    
            res.status(200).json({
                success: true,
                message: "This product successfully booked."
            })
        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message
            })
        }
    }

    static GetAllBookingPending = async (req, res) => {  
        try {
            const GetAllBookingPending = await Book.find({status: "Pending"})
        
            let detailObj = []

            for(let i=0; i<GetAllBookingPending.length; i++){
                const ProductInfo = await Product.findOne({_id: GetAllBookingPending[i].productId, bakeryId: req.user._id})
                const BookingInfo = await Book.findOne({productId: ProductInfo?._id})
                const BakeryInfo = await User.findById(req.user._id)
                const subscriberInfo = await User.findById(BookingInfo?.subscriberId)
                
                const BookingDetailsObj= {
                    bookingId: BookingInfo?._id,
                    subcbriberName: subscriberInfo?.userName,
                    bakeryName: BakeryInfo.bakeryName,
                    productName: ProductInfo?.productName,
                    businessHours: BakeryInfo.businessHours,
                    price: ProductInfo?.price,
                    discountPrice: ProductInfo?.discountPrice,
                    quantity: BookingInfo?.discountPrice,
                    availabilty: BookingInfo?.availabilty,
                    days: BookingInfo?.days,
                    productdetail: BookingInfo?.productdetail,
                    status: BookingInfo?.status,
                    Location: BakeryInfo?.Location
                }
                detailObj.push(BookingDetailsObj)
            }

            res.status(200).json({
                success: true,
                data: detailObj
            })
        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message
            })
        }
    }

    static BookIsReadyFromOwner = async (req, res) => {
        const BookingId = req.params.id

        try {
            const BookingData = await Book.findByIdAndUpdate(BookingId, {
                $set: {
                    status: "Ready"
                }
            }, {new: true})
    
            res.status(200).json({
                success: true,
                message: "Order is now ready",
                data: BookingData
            })
        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message,
            })
        }

    }
    
    static GetAllReadyBooking = async (req, res) =>{
        const GetAllBookingPending = await Book.find({status: "Ready"})

        try {
            if(req.user.type !== "Rider"){
                return res.status(200).json({
                    success: false,
                    message: "You aren't a rider."
                })
            }

            let detailObj = []

            for(let i=0; i<GetAllBookingPending.length; i++){
                const BookingInfo = await Book.findById(GetAllBookingPending[i]._id) 
                const ProductInfo = await Product.findById(GetAllBookingPending[i].productId)
                const BakeryInfo = await User.findById(ProductInfo.bakeryId)
                const subscriberInfo = await User.findById(GetAllBookingPending[i].subscriberId)

                const BookingDetailsObj= {
                    bookingId: BookingInfo._id,
                    subcbriberName: subscriberInfo.userName,
                    bakeryName: BakeryInfo.bakeryName,
                    productName: ProductInfo.productName,
                    businessHours: BakeryInfo.businessHours,
                    price: ProductInfo.price,
                    discountPrice: ProductInfo.discountPrice,
                    Location: BakeryInfo.Location,
                    status: BookingInfo.status
                }
                detailObj.push(BookingDetailsObj)
            }

            res.status(200).json({
                success: true,
                data: detailObj
            })
        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message
            })
        }
    }

    static OrderBookFromRider = async (req, res) => {
        const { BookingId, bookingStatus } = req.body
        const riderId = req.user._id
        const bookingDropImg = req.file ? req.file.filename : ""

        if(req.user.type !== "Rider"){
            return res.status(200).json({
                success: false,
                message: "You aren't eligible to confirm the booking ride."
            })
        }

        try {
            const BookingExist = await Book.findOne({riderId:riderId, _id: BookingId})
            
            if(!BookingExist){
                const OrderBookFromRider = await Book.findByIdAndUpdate(BookingId, {
                    $set: {
                        riderId,
                        status: bookingStatus
                    }
                }, {new: true})
    
                res.status(200).json({
                    success: true,
                    message: "Order booked from rider",
                    data: OrderBookFromRider
                })
            }
            else{
                if(bookingStatus === "Start"){
                    return res.status(200).json({
                        success: false,
                        message: "Order already booked from rider.",
                        data: BookingExist
                    })
                }
                else if(bookingStatus === "Pick"){
                    BookingExist.status = bookingStatus
                    await BookingExist.save()
    
                    res.status(200).json({
                        success: true,
                        message: "Order pick successfully.",
                        data: BookingExist
                    })
                }
                else if(bookingStatus === "Drop"){
                    BookingExist.status = bookingStatus
                    BookingExist.bookingDropImg = bookingDropImg
                    await BookingExist.save()
    
                    res.status(200).json({
                        success: true,
                        message: "Order Drop successfully.",
                        data: BookingExist
                    })
                }
            }

        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message
            })
        }
    }
}

module.exports = BookController