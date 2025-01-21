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
    
      static GetAllProductByCatagories = async (req, res) => {
    const { bakeryId, chooseCategory } = req.body;

    if (chooseCategory == "All") {
      const getProductbyCatagories = await Product.find({bakeryId: bakeryId}).sort({createdAt: -1});
      res.send({
        message: "All products",
        getProductbyCatagories,
      });
    } else {
      const getProductbyCatagories = await Product.find({
          bakeryId: bakeryId,
        chooseCategory: chooseCategory,
      }).sort({createdAt: -1});
      res.send({
        message: "All products related to this catagory",
        getProductbyCatagories,
      });
    }
  };

  static SearchProductByNameAndCategory = async (req, res) => {
    try {
      const { bakeryId, searchTerm } = req.body;

      // Build the query object
      const query = {
        $or: [
          { productName: { $regex: searchTerm, $options: "i" } }, // Match product name
          { chooseCategory: { $regex: searchTerm, $options: "i" } }, // Match category name
        ],
      };

        const getProducts = await Product.find({bakeryId:bakeryId, ...query}).sort({createdAt: -1});


      if (getProducts.length === 0) {
        return res.status(404).send({
          message: "No products found matching the search criteria",
        });
      }

      res.status(200).send({
        message: "Products matching the search criteria",
        products: getProducts,
      });
    } catch (error) {
      res.status(500).send({
        message: "Error occurred while searching for products",
        error: error.message,
      });
    }
  };

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