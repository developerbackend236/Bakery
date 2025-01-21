const express = require('express')
const Route = express.Router()
const AuthMiddleware = require('../Middleware/AuthMiddleware.js')
const AuthController = require('./../Controllers/AuthController.js')
const ProductController = require('./../Controllers/ProductController.js')
const BookController = require('./../Controllers/BookController')
const PostController = require('../Controllers/PostController.js')
const multer = require('multer')

// Multer For Upload Pics
const BakeryPicStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Bakery');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Create multer upload instance
const uploadBakeryPic = multer({ storage: BakeryPicStorage });

// Multer For Upload Pics
const DropPicStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Drop');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Create multer upload instance
const uploadDropPic = multer({ storage: DropPicStorage });

// Multer For Upload Pics
const UserPicStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/User');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Create multer upload instance
const uploadUserPic = multer({ storage: UserPicStorage });


// Multer For Upload Pics
const PostPicStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Post');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Create multer upload instance
const uploadPostPic = multer({ storage: PostPicStorage });


// Static File 
// Access Bakery Images
Route.use('/bakery', express.static('Public/Bakery'))
Route.use('/user', express.static('Public/User'))
Route.use('/drop', express.static('Public/Drop'))
Route.use('/Post', express.static('Public/Post'))


// Auth
Route.post('/user/register', AuthController.Register)
Route.post('/user/login', AuthController.Login)
Route.post('/user/edit-profile', AuthMiddleware, uploadUserPic.single('profilePic'), AuthController.EditProfile)

// Product
Route.post('/bakery/add-product', AuthMiddleware, uploadBakeryPic.single('productImage'), ProductController.AddProduct)
Route.get('/bakery/product-by-prId/:id', AuthMiddleware, ProductController.GetProductByProductID)
Route.get('/bakery/all-product', AuthMiddleware, ProductController.GetAllProductByBakeryID)
Route.get('/bakery/get-all-booking-pending', AuthMiddleware, BookController.GetAllBookingPending)
Route.post('/bakery/booking-ready-owner/:id', AuthMiddleware, BookController.BookIsReadyFromOwner)

// Booking
Route.get('/subscriber/get-all-product', AuthMiddleware, ProductController.GetAllProduct)
Route.post('/subscriber/product-booking/:id', AuthMiddleware, BookController.ProductBooking)
Route.post('/subscriber/GetAllMyBookingProducts', AuthMiddleware, BookController.GetAllMyBookingProducts)
Route.post('/bakery/GetAllProductByCatagories', AuthMiddleware, ProductController.GetAllProductByCatagories)
Route.post('/bakery/SearchProductByNameAndCatagoreis', AuthMiddleware, ProductController.SearchProductByNameAndCategory)


// Rider
Route.get('/rider/get-all-ready-booking', AuthMiddleware, BookController.GetAllReadyBooking)
Route.post('/rider/order-book-from-rider', AuthMiddleware, uploadDropPic.single('bookingDropImg'), BookController.OrderBookFromRider)
Route.post('/rider/accept-booking', BookController.orderAcceptedByRider);
Route.post('/rider/rejected-booking', BookController.orderRejectedByRider);
Route.post('/rider/create-vehilce-profile', AuthController.createVehicleProfile);
Route.post('/rider/edit-vehicle', AuthController.editVehicleProfile);
Route.get('/rider/get-all-accepted-booking', AuthMiddleware, BookController.getAcceptedOrdersByRider);
Route.get('/rider/get-all-accepted-completed-booking', AuthMiddleware, BookController.getAllCompletedOrdersByRider);




//posting social media 
Route.post('/post/createPost', AuthMiddleware, uploadPostPic.single("postPicture"), PostController.createPost)
Route.get('/post/getAllPost', AuthMiddleware, PostController.getAllPost)

Route.post('/post/LikeAPost', AuthMiddleware, PostController.LikeAPost)
Route.post('/post/CommentAPost', AuthMiddleware, PostController.CommentAPost)
Route.post('/post/ShareAPost', AuthMiddleware, PostController.ShareAPost)


module.exports = Route
