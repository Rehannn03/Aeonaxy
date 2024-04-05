import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { User } from "../model/user.model.js";
// import Course from "../models/course.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import emailVerification from "../utils/emailVerification.js";
import { passwordStrength } from "check-password-strength";

const registerUser=asyncHandler(async(req,res,_)=>{
    const{name,email,password,role}=req.body

    if (name === "") {
        throw new ApiError(400, "Please Enter Full name");
      } else if (email === "") {
        throw new ApiError(400, "Please enter email");
      } else if (password === "") {
        throw new ApiError(400, "Please enter password");
      }
      const strength=passwordStrength(password)
      console.log(strength)
      if(strength.id<2){
          throw new ApiError(400,"Password is weak")
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

const loginUser=asyncHandler(async(req,res)=>{
    const{email,password}=req.body
    if(email===""||password===""){
        throw new ApiError(400,"Please enter email and password")
    }

    const user=await User.findOne({email}).select("-createdAt -updatedAt")
    if(!user){
        throw new ApiError(400,"User not found")
    }

    if(!user.confirmed){
        throw new ApiError(400,"Please verify your email")
    }

    const checkpassword=await user.matchPassword(password)

    if(!checkpassword){
        throw new ApiError(400,"Invalid password")
    }

    const accessToken=await user.generateAccessToken()
    const refreshtoken=await user.generateRefreshToken()
    user.refreshToken=refreshtoken
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .cookie('accessToken',accessToken,options)
    .cookie('refreshToken',refreshtoken,options)
    .json(
        new ApiResponse(
            200,
            user,
            "User logged in successfully"
        )
    )
})

const logoutUser=asyncHandler(async(req,res)=>{
    User.findByIdAndUpdate(
        req.user._id,
        {
            refreshToken:""
        },
        {
            new:true
        }
    )

    const options={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie('accessToken',options)
    .clearCookie('refreshToken',options)
    .json({
        message:"User logged out successfully"
    })
})

const viewProfile=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.user._id).select("-password -createdAt -updatedAt -refreshToken")
    if(!user){
        throw new ApiError(400,"User not found")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "User profile retrieved successfully"
        )
    )
})

const updateProfile=asyncHandler(async(req,res)=>{
    //name email password avatar 
    //name from req.user
    //email from req.user verify email 
    //password from req.user verify password

    const{name,email,avatar}=req.body
    const user=await User.findById(req.user._id).select("-password -createdAt -updatedAt -refreshToken")

    if(!user){
        throw new ApiError(400,"User not found")
    }

    if(name){
        user.name=name
        user.save()
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "User name updated successfully"
            )
        )

    }

    if(email){
        user.confirmed=false
        user.email=email
        user.save()
        const emailverification=emailVerification(email,user._id)
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "User email updated successfully"
            )
        )

    }

    if(req.files && Array.isArray(req.files.avatar) && req.files.avatar.length>1){
        const avatarPath=req.files.avatar[0].path
        avatar=await uploadOnCloudinary(avatarPath)
        user.avatar=avatar.url
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "User avatar updated successfully"
            )
        )
    }

    return res
    .status(400)
    .json(
        new ApiResponse(
            400,
            null,
            "No data to update"
        )
    )
})

const changePassword=asyncHandler(async(req,res)=>{
    const{oldpassword,newpassword,confirmpassword}=req.body
    const user=await User.findById(req.user._id).select("-createdAt -updatedAt -refreshToken")
    if(!user){
        throw new ApiError(400,"User not found")
    }
    if(oldpassword===newpassword){
        throw new ApiError(400,"New password cannot be the same as old password")
    }

    if(confirmpassword!==newpassword){
        throw new ApiError(400,"Password does not match")
    }

    const strength=passwordStrength(newpassword)
    if(strength.id<2){
        throw new ApiError(400,"Password is weak")
    }

    const checkpassword=await user.matchPassword(oldpassword)
    if(!checkpassword){
        throw new ApiError(400,"Invalid password")
    }

    user.password=newpassword
    user.save()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "Password updated successfully"
        )
    )

}
)
export {
    registerUser,
    verifyEmail,
    loginUser,
    logoutUser,
    viewProfile,
    updateProfile
}