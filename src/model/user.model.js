import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"user"
    },
    avatar:{
        type:String
    },
    courseTaken:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }],
    confirmed:{
        type:Boolean,
        default:false
    }
    
},{timestamps:true})


userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next()

    this.password=await bcrypt.hash(this.password,10)
})

userSchema.methods.matchPassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            name:this.name,
            role:this.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn:process.env.JWT_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn:process.env.JWT_REFRESH_EXPIRY
        }
    )
}

export const User=mongoose.model("User",userSchema)