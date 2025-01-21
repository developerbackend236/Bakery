const User = require('./../Models/UserModal.js')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

class AuthController{
    static Register = async (req, res) => {
        const { userName, email, password, address, type} = req.body
        try {
            const existingUser = await User.findOne({ email: email });
            if (existingUser) {
                return res.status(200).json({
                    success: false,
                    message: "Email already exists"
                });
            }
            else {
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(password, salt);

                const newUser = new User({
                    _id: new mongoose.Types.ObjectId(),
                    userName: userName,
                    email: email,
                    password: hash,
                    address: address,
                    type: type,
                    updatedProfile: "0",
                });
                await newUser.save();

                res.status(200).json({
                    success: true,
                    message: "User has been registered"
                });
            }
        } catch (err) {
            res.status(200).json({
                success: false,
                message: err.message
            });
        }
    }

    static Login = async (req, res) => {
        const { email, password, type } = req.body
        const UserExist = await User.findOne({ email: email, type: type })
        if (UserExist) {
            bcrypt.compare(password, UserExist.password, (err, result) => {
                if (result) {
                    const token = jwt.sign({
                        id: UserExist._id,
                        userName: UserExist.userName,
                        email: UserExist.email,
                        type: UserExist.type,
                    },
                        process.env.AppToken
                    )
                if (type === "Owner"){
                        const owner = {
                            _id: UserExist._id,
                            userName: UserExist.userName,
                            email: UserExist.email,
                            address: UserExist.address,
                            type: UserExist.type,
                            updatedProfile: UserExist.updatedProfile,
                            phoneNumber: UserExist.phoneNumber,
                            DOB: UserExist.DOB,
                            city: UserExist.city,
                            bakeryName: UserExist.bakeryName,
                            bakeryWebsite: UserExist.bakeryWebsite,
                            businessHours: UserExist.businessHours,
                            categories: UserExist.categories,
                            Location: UserExist.Location,
                            profilePic: UserExist.profilePic,
                            token: token
                        }
                        return res.status(200).json({
                            success: true,
                            data: owner
    
                        });
                } 
                if (type !== "Owner") {
                    const rider = {
                            _id: UserExist._id,
                            userName: UserExist.userName,
                            email: UserExist.email,
                            phoneNumber: UserExist.phoneNumber,
                            DOB: UserExist.DOB,
                            state: UserExist.state,
                            city: UserExist.city,
                            zipCode: UserExist.zipCode,
                            profilePic: UserExist.profilePic,
                            updatedProfile: UserExist.updatedProfile,
                            token: token
                        }
                    return res.status(200).json({
                            success: true,
                            data: rider
    
                        });

                    };
                }
                else {
                    res.status(200).json({
                        success: false,
                        message: "Password doesn't match"
                    })
                }
            })
        }

        else {
            res.status(200).json({
                success: false,
                message: "Email doesn't exist."
            })
        }

    }

    static EditProfile = async (req, res) => {
        const profilePic = req.file ? req.file.filename : ""
        let { userName, address, phoneNumber, DOB, city, bakeryName, bakeryWebsite, businessHours, categories, Longtitude, Latitude, state, zipCode} = req.body
        // userName = userName === undefined ? "" : userName
        

        try {
            const UserData = req.user;

            if(UserData.type === "Owner"){
                UserData.userName = userName
                UserData.address = address
                UserData.phoneNumber = phoneNumber
                UserData.DOB = DOB
                UserData.city = city
                UserData.bakeryName = bakeryName
                UserData.bakeryWebsite = bakeryWebsite
                UserData.businessHours = businessHours
                UserData.categories = categories
                UserData.Location = {
                    type:"Point",
                    coordinates:[
                        parseFloat(Longtitude),
                        parseFloat(Latitude)
                    ]
                },
                UserData.profilePic = ( profilePic ? profilePic : UserData.profilePic)
                UserData.updatedProfile = "1"
                await UserData.save()
        
                return res.status(200).json({
                    success: true,
                    message: "Profile has been updated",
                    data: UserData
                })
            }
            if(UserData.type !== "Owner"){
                UserData.userName = userName
                UserData.phoneNumber = phoneNumber
                UserData.DOB = DOB
                UserData.state = state
                UserData.city = city
                UserData.zipCode = zipCode
                UserData.profilePic = ( profilePic ? profilePic : UserData.profilePic)
                UserData.updatedProfile = "1"
                await UserData.save()
        
                return res.status(200).json({
                    success: true,
                    message: "Profile has been updated",
                    data: UserData
                })
            }

        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message
            })
        }
    }
    
    static createVehicleProfile = async (req, res) => {
        try {
            // const type = req.user.type;
            const { type } = req.body;
            if(type === "Rider"){
                const { riderId, make, model, vehicleNumber, riderLisence } = req.body;
            
                const vehicleProfie = new vehicleModel({
                    riderId: riderId,
                    make: make,
                    model: model,
                    vehicleNumber: vehicleNumber,
                    riderLisence: riderLisence 
                })

                const result = await vehicleProfie.save();
                return res.status(200).json({
                    sucess: true,
                    msg: "Vehicle Profile is Created Successfully!"
                })
            } else {
                return res.status(403).json({
                    sucess: false,
                    msg: "Only Riders are Allowed to Create Vehicle Profile "
                })
            }
        } catch (error) {
            console.log('Error Msg: ', error)
            res.status(400).json({
                success: false,
                message: error.message
            })
        }
    }

    static editVehicleProfile = async (req, res) => {
        try {
            const { type } = req.body;
            if(type === "Rider"){
                const { riderId } = req.body;
                const data = req.body;

                // const updatedVehicle = await vehicleModel.findOne({riderId});
                const updatedVehicle = await vehicleModel.findOneAndUpdate( {riderId: riderId},
                    {$set: data},
                    { new: true }
                )
                console.log("Vehicle: ",updatedVehicle)
                return res.status(200).json({
                    sucess: true,
                    msg: "Vehicle Updated Successfully!",
                    data: updatedVehicle
                })
            }else {
                return res.status(403).json({
                    sucess: false,
                    msg: "Only Riders are Allowed to Edit Vehicle Details"
                })
            }
        } catch (error) {
            console.log('Error Msg: ', error)
            res.status(400).json({
                success: false,
                message: error.message
            })
        }
    }

}

module.exports = AuthController