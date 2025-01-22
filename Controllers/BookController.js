const Product = require("../Models/ProductModal.js");
const Book = require("../Models/BookModal.js");
const User = require("../Models/UserModal.js");
const BookModal = require("../Models/BookModal.js");

class BookController{

    static ProductBooking = async (req, res) => {
    const productId = req.params.id;
    const { bakeryId, availabilty, days, quantity, TotalPrice, BakeryId, Longitude, Latitude } = req.body;

    try {
      // You could validate and prepare the data here, but avoid sending any response early

      // Check if the user is a Subscriber
      if (req.user.type !== "Subscriber") {
        return res.status(200).json({
          success: false,
          message: "You aren't eligible for booking this product.",
        });
      }

      // Check if the product exists
      const ProductExist = await Product.findById(productId);

      if (!ProductExist) {
        return res.status(200).json({
          success: false,
          message: "Product doesn't exist.",
        });
      }

      // Create the booking
      const createBooking = new Book({
        productId,
        quantity,
        availabilty,
        days: availabilty !== "daily" ? days : "",
        subscriberId: req.user._id,
        BakeryId,
        Location: Location = {
            type:"Point",
            coordinates:[
                parseFloat(Longitude),
                parseFloat(Latitude)
            ]
        },
        TotalPrice,
        orderStatus: "Pending",
      });
      await createBooking.save();

      // Send success response
      return res.status(200).json({
        success: true,
        message: "This product was successfully booked.",
      });
    } catch (error) {
      // Send error response
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

    static GetAllMyBookingProducts = async (req, res) => {
    const userId = req.user._id;

    const userData = req.user;

    if (userData.type == "Subscriber") {
      const BookModal = await Book.find({ subscriberId: userId })
        .populate("subscriberId") // Populate subscriber data
        .populate("productId") // Populate product data
        .populate("riderId") // Optionally populate rider data
        .populate("BakeryId") // Optionally populate bakery data
        .exec();

      res.send({
        userId: BookModal,
        userData,
      });
    }else if(userData.type == "Owner"){
        const BookModal = await Book.find({ BakeryId: userId })
        .populate("subscriberId") // Populate subscriber data
        .populate("productId") // Populate product data
        .populate("riderId") // Optionally populate rider data
        .populate("BakeryId") // Optionally populate bakery data
        .exec();

      res.send({
        userId: BookModal,
        userData,
      });
    }else{
        const BookModal = await Book.find({ riderId: userId })
        .populate("subscriberId") // Populate subscriber data
        .populate("productId") // Populate product data
        .populate("riderId") // Optionally populate rider data
        .populate("BakeryId") // Optionally populate bakery data
        .exec();

      res.send({
        userId: BookModal,
        userData,
      });
    }
  };

    static GetAllBookingPending = async (req, res) => {  
        try {
            const GetAllBookingPending = await Book.find({orderStatus: "Pending"})
        
            // let detailObj = []

            // for(let i=0; i<GetAllBookingPending.length; i++){
            //     const ProductInfo = await Product.findOne({_id: GetAllBookingPending[i].productId, bakeryId: req.user._id})
            //     const BookingInfo = await Book.findOne({productId: ProductInfo?._id})
            //     const BakeryInfo = await User.findById(req.user._id)
            //     const subscriberInfo = await User.findById(BookingInfo?.subscriberId)
                
            //     const BookingDetailsObj= {
            //         bookingId: BookingInfo?._id,
            //         subcbriberName: subscriberInfo?.userName,
            //         bakeryName: BakeryInfo.bakeryName,
            //         productName: ProductInfo?.productName,
            //         businessHours: BakeryInfo.businessHours,
            //         price: ProductInfo?.price,
            //         discountPrice: ProductInfo?.discountPrice,
            //         quantity: BookingInfo?.discountPrice,
            //         availabilty: BookingInfo?.availabilty,
            //         days: BookingInfo?.days,
            //         productdetail: BookingInfo?.productdetail,
            //         status: BookingInfo?.status,
            //         Location: BakeryInfo?.Location
            //     }
            //     detailObj.push(BookingDetailsObj)
            // }

            res.status(200).json({
                success: true,
                data: GetAllBookingPending
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
                    orderStatus: "Ready"
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
        const riderId = req.user.id
        const GetAllBookingPending = await Book.find({orderStatus: "Ready", rejectedBy: {$nin: [riderId]},
            riderStatus: {$ne: "Accepted"}
        })

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
                    productImage: ProductInfo.productImage,
                    businessHours: BakeryInfo.businessHours,
                    price: ProductInfo.price,
                    discountPrice: ProductInfo.discountPrice,
                    Location: BakeryInfo.Location,
                    orderStatus: BookingInfo.orderStatus,
                    rejectedBy: BookingInfo.rejectedBy
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
                        orderStatus: bookingStatus
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
                    BookingExist.orderStatus = bookingStatus
                    await BookingExist.save()
    
                    res.status(200).json({
                        success: true,
                        message: "Order pick successfully.",
                        data: BookingExist
                    })
                }
                else if(bookingStatus === "Drop"){
                    BookingExist.orderStatus = bookingStatus
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
    
    static orderAcceptedByRider = async (req, res) => {
        try {
            const {bookingId, riderStatus, orderStatus, type, riderId } = req.body;
            // const type = req.user.type
            // const riderId = req.user.id;
            if (type === "Rider"){
                if(orderStatus === "Ready"){
                    if(riderStatus === "Accepted"){
                        const bookingAceeptedByRider = await Book.findByIdAndUpdate(bookingId, 
                            {$set:{ riderStatus: riderStatus, acceptedBy: riderId }},
                            { new: true})
                            return res.status(200).json({
                                    sucess: true,
                                    msg: "Order Accepted By Rider",
                                    data: bookingAceeptedByRider
                                })
                    } else {
                        return res.status(403).json({
                            sucess: false,
                            msg: "Order is not Accepted"
                        })
                    }
                } else {
                    return res.status(400).json({
                        sucess: false,
                        msg: "Order Is not Ready Right Now"
                    })
                }
            } else{
                return res.status(400).json({
                    sucess: false,
                    msg: "You Are Not Authorized! Only Rides Can Accept Orders..!"
                })
            } 
        } catch (error) {
            res.status(403).json({
                success: false,
                message: error.message
            })
        }
    };

    static orderRejectedByRider = async (req, res) => {
        try {
            const { bookingId, riderId, riderStatus, type } = req.body;
            if( type === "Rider"){
                if(riderStatus === "Rejected"){
                    const booking = await Book.findByIdAndUpdate(bookingId,
                        { $push: {rejectedBy: riderId}},
                        { new: true});
                    return res.status(200).json({
                        sucess: true,
                        msg: "Order Is Rejected!",
                        data: booking});
                }
            }else{
                return res.status(400).json({
                    sucess: false,
                    msg: "You Are Not Authorized! Only Rides Can Reject Orders..!"
                })
            }
        } catch (error) {
            res.status(403).json({
                success: false,
                message: error.message
            })
        }
    };
    
        static getAcceptedOrdersByRider = async (req, res) => {
        try {
            const riderId = req.user.id;
            const type = req.user.type;
            // console.log("Rider: ", riderId)
            // console.log("Type: ", type)
            if(type === "Rider"){
                 const allAcceptedBookings = await Book.find({
                    acceptedBy: riderId, 
                    riderStatus: "Accepted" , 
                    orderStatus:{$ne: "Drop"}}).populate({
                        path:'productId',
                        select: 'productName flavor chooseCategory productImage'}).populate({
                            path:"BakeryId",
                            select: "userName bakeryName businessHours Location"
                        });

                    
                        // console.log("Data",allAcceptedBookings)
                return res.status(200).json({
                    sucess: true,
                    msg: "All Accepted On Going Bookings",
                    data: allAcceptedBookings
                })
            } else {
                res.status(403).json({
                    success: false,
                    message: "Only Riders Are Authorized to get All Accepted Bookings"
                })                
            }
        } catch (error) {
            res.status(403).json({
                success: false,
                message: error.message
            })
        }
    };
    
        static getAllCompletedOrdersByRider = async (req, res) => {
        try {
            const riderId = req.user.id;
            const type = req.user.type;
            if(type === "Rider"){
                const allCompletedBookings = await Book.find({ 
                    acceptedBy: riderId, 
                    riderStatus:"Accepted", 
                    orderStatus: "Drop"}).populate({
                        path: "productId",
                        select: 'productName flavor chooseCategory productImage'
                    }).populate({
                            path:"BakeryId",
                            select: "userName bakeryName businessHours Location"
                        });

                    return res.status(200).json({
                        sucess: true,
                        msg: "All Accepted Completed Bookings",
                        data: allCompletedBookings
                    })
            }else{
                res.status(403).json({
                    success: false,
                    message: "Only Riders Are Authorized to get All Accepted Bookings"
                })
            }
        } catch (error) {
            res.status(403).json({
                success: false,
                message: error.message
            })
        }
    };
}

module.exports = BookController