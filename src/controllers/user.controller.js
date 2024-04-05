import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { User } from "../model/user.model.js";
// import Course from "../models/course.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import emailVerification from "../utils/emailVerification.js";

const registerUser=asyncHandler(async(req,res,_)=>{
    const{name,email,password,role}=req.body

    if (name === "") {
        throw new ApiError(400, "Please Enter Full name");
      } else if (email === "") {
        throw new ApiError(400, "Please enter email");
      } else if (password === "") {
        throw new ApiError(400, "Please enter password");
      }
    const user=await User.find({email}).select("-password")
    if(user.length>0){
        throw new ApiError(400,"User already exists")
    }

    let avatarPath;
    let avatar
    if(req.files && Array.isArray(req.files.avatar) && req.files.avatar.length>1){
        avatarPath=req.files.avatar[0].path
        avatar=await uploadOnCloudinary(avatarPath)
    }
    
    const newUser=await User.create({
        name:name.toLowerCase(),
        email,
        password,
        role,
        avatar:avatar?.url||""
    })
    const emailverification=emailVerification(email,newUser._id)
    console.log(emailverification)
    const createdUser = await User.findById(newUser._id).select("-password");
    if (!createdUser) {
        throw new ApiError(400, "User not created");
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            newUser,
            "User created successfully"
        )
    )
})

const verifyEmail=asyncHandler(async(req,res)=>{
    const{id}=req.params
    const user=await User.findByIdAndUpdate(
        id,
        {
            confirmed:true
        },
        {
            new:true
        }
    ).select("-password -createdAt -updatedAt")
    if(!user){
        throw new ApiError(400,"User not found")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "Email verified successfully"
        )
    )
})

export {
    registerUser,
    verifyEmail
}