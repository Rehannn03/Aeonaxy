import { registerUser,verifyEmail,loginUser,logoutUser,viewProfile,updateProfile,changePassword,viewEnrolledCourses,enrollCourse} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {Router} from 'express'
const router = Router()


router.post('/register',upload.single('avatar'),registerUser)
router.get('/verifyEmail/:id',verifyEmail)
router.post('/login',loginUser)
router.post('/logout',verifyJWT,logoutUser)
router.get('/profile',verifyJWT,viewProfile)
router.patch('/profile/update',verifyJWT,upload.single('avatar'),updateProfile)
router.patch('/profile/changePassword',verifyJWT,changePassword)
router.get('/enrolledCourses',verifyJWT,viewEnrolledCourses)
router.patch('/enrollCourse/:id',verifyJWT,enrollCourse)
export default router