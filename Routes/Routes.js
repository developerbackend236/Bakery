const express = require('express')
const Route = express.Router()
const AuthMiddleware = require('../Middleware/AuthMiddleware.js')
const AuthController = require('./../Controllers/AuthController.js')
const ProductController = require('./../Controllers/ProductController.js')
const BookController = require('./../Controllers/BookController')
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

// Static File 
// Access Bakery Images
Route.use('/bakery', express.static('Public/Bakery'))

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

// Rider
Route.get('/rider/get-all-ready-booking', AuthMiddleware, BookController.GetAllReadyBooking)
Route.post('/rider/order-book-from-rider', AuthMiddleware, uploadDropPic.single('bookingDropImg'), BookController.OrderBookFromRider)

module.exports = Route
