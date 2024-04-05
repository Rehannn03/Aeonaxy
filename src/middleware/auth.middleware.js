import { User } from "../model/user.model.js";
import  ApiError  from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'

export const verifyJWT=asyncHandler(async(req,_,next)=>{
    try {
        const token=req.cookies?.accessToken || req.header("Authorization").replace("Bearer ","")
        if(!token){
            throw new ApiError(401,"Unauthorized access")
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET)

        const user=await User.findById(decoded?._id).select("-password -refreshToken")

        req.user=user
        next()
    } catch (error) {
        throw new ApiError(401,error.message || "Invalid token")
    }
})