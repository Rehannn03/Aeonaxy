import { createCourse,readCourse,updateCourse,deleteCourse,viewCourses} from "../controllers/courses.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

import { Router } from "express";

const router = Router();


router.post("/createCourse",verifyJWT,createCourse)
router.get("/readCourse",verifyJWT,readCourse)
router.patch("/updateCourse/:id",verifyJWT,updateCourse)
router.delete("/deleteCourse/:id",verifyJWT,deleteCourse)
router.get("/viewCourses",viewCourses)
export default router