import ApiError from "../utils/apiError.js";
import ApiResponse from '../utils/apiResponse.js'
import { Course } from "../model/course.model.js";
import asyncHandler from '../utils/asyncHandler.js'


const createCourse=asyncHandler(async(req,res)=>{
    const {courseName,courseDescription,coursePrice,courseDuration,category,language,level,conductedBy,rating,reviewNumber}=req.body

    const userRole=req.user.role
    if(userRole!=="admin"){
        throw new ApiError(403,"You are not authorized to create course")
    }

    const course = await Course.findOne({courseName}).select("-__v -_id -popularity -rating -reviewNumber -createdAt -updatedAt")
    
    if(course){
        throw new ApiError(400,"Course already exists")
    }

    const newCourse=await Course.create({
        courseName,
        courseDescription,
        coursePrice,
        courseDuration,
        category,
        language,
        level,
        conductedBy,
        rating,
        reviewNumber
    })

    if(!newCourse){
        throw new ApiError(400,"Course not created")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            newCourse,
            "Course created successfully"
        )
    )
})

const readCourse=asyncHandler(async(req,res)=>{
    const page=parseInt(req.query.page) || 1
    const limit=parseInt(req.query.limit) || 10
    const userRole=req.user.role
    if(userRole!=="admin" ){
        throw new ApiError(403,"You are not authorized to view courses")
    }
    const courses=await Course.find().select("-__v -_id -popularity -rating -reviewNumber -createdAt -updatedAt").limit(limit*1).skip(page>0?(page-1)*limit:0).exec()

    if(courses.length===0){
        throw new ApiError(404,"No courses found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            courses,
            "Courses fetched successfully"
        )
    )

})

const updateCourse=asyncHandler(async(req,res)=>{
    const {courseName,courseDescription,coursePrice,courseDuration,category,language,level,conductedBy}=req.body
    const {id}=req.params
    const userRole=req.user.role
    if(userRole!=="admin"){
        throw new ApiError(403,"You are not authorized to update course")
    }

    const course=await Course.findByIdAndUpdate(
        id,
        {
            courseName,
            courseDescription,
            coursePrice,
            courseDuration,
            category,
            language,
            level,
            conductedBy
        },
        {
            new:true
        }
    ).select("-__v -_id -popularity -rating -reviewNumber -createdAt -updatedAt")

    if(!course){
        throw new ApiError(400,"Course not updated")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            course,
            "Course updated successfully"
        )
    )
})

const deleteCourse=asyncHandler(async(req,res)=>{
    const {id}=req.params
    const userRole=req.user.role
    if(userRole!=="admin"){
        throw new ApiError(403,"You are not authorized to delete course")
    }

    const course=await Course.findByIdAndDelete(id)

    if(!course){
        throw new ApiError(400,"Course not deleted")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            null,
            "Course deleted successfully"
        )
    )
})

const viewCourses=asyncHandler(async(req,res)=>{
    const {category,level,duration,rating,language}=req.query
    const page=parseInt(req.query.page) || 1
    const limit=parseInt(req.query.limit) || 10
    const query={}

    if(category){
        query.category=category
    }
    if(level){
        query.level=level
    }
    if(duration){
        query.courseDuration=duration
    }
    if(rating){
        query.rating={$gte:rating}
    }
    if(language){
        query.language=language
    }

    const courses=await Course.find(query).select("-__v -_id -createdAt -updatedAt").limit(limit*1).skip(page>0?(page-1)*limit:0).sort({popularity:-1}).exec()

    if(courses.length===0){
        return res
        .json(
            new ApiResponse(
                404,
                null,
                "No courses found"
            )
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            courses,
            "Courses fetched successfully"
        )
    )
    
})


export {
    createCourse,
    readCourse,
    updateCourse,
    deleteCourse,
    viewCourses
}