const Product = require('../Models/ProductModal.js')
const dotenv = require('dotenv').config()

class ProductController {

    static AddProduct = async (req, res) => {
        const productImage = req.file ? req.file.filename : ""
        const { productName, price, discountPrice, productDescp, chooseCategory, stockQuantity, flavor } = req.body

        try {

            if(req.user.type !== "Owner"){
                res.status(200).json({
                    success: false,
                    message: "You aren't eligible to upload the products."
                })
            }

            const newProduct = new Product({
                bakeryId: req.user._id,
                productName,
                price,
                discountPrice,
                productDescp,
                flavor,
                chooseCategory,
                stockQuantity,
                productImage
            })
            await newProduct.save()
    
            res.status(200).json({
                success: true,
                message: "Product has been uploaded successfully."
            })
        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message
            }) 
        }
    }

    static GetProductByProductID = async (req, res)=>{
        const ProductId = req.params.id

        try {
            const ProductInfo = await Product.findById(ProductId)

            res.status(200).json({
                success: true,
                imgPath: process.env.BakeryImgURL,
                data: ProductInfo
            })
        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message
            })
        }
    }

    static GetAllProductByBakeryID = async (req, res)=>{
        try {
            const AllProductInfo = await Product.find({bakeryId: req.user._id})

            res.status(200).json({
                success: true,
                imgPath: process.env.BakeryImgURL,
                data: AllProductInfo
            })
        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message
            })
        }
    }

    static GetAllProduct = async (req, res)=>{
        try {
            const AllProductsInfo = await Product.find({ })

            res.status(200).json({
                success: true,
                imgPath: process.env.BakeryImgURL,
                data: AllProductsInfo
            })
        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message
            })
        }
    }
}

module.exports = ProductController