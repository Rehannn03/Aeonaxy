import mongoose from "mongoose";

const courseSchema=new mongoose.Schema({
    courseName:{
        type:String,
        required:true
    },
    courseDescription:{
        type:String,
        required:true
    },
    coursePrice:{
        type:Number,
        required:true
    },
    courseDuration:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    language:{
        type:String,
        required:true
    },
    level:{
        type:String,
        required:true,
        enum:["Beginner","Intermediate","Advanced"]
    },
    conductedBy:{
        type:String,
        required:true
    },
    popularity:{
        type:Number,
        default:0
    },
    rating:{
        type:Number,
        default:0
    },
    reviewNumber:{
        type:Number,
        default:0
    }
})

courseSchema.pre('save',function(next){
    this.popularity=(this.reviewNumber/this.rating).toFixed(2)
    return next()
})



export const Course = mongoose.model('Course',courseSchema)