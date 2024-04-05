import { registerUser,verifyEmail } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import express from 'express'
import {Router} from 'express'
const router = Router()


router.post('/register',upload.single('avatar'),registerUser)
router.get('/verifyEmail/:id',verifyEmail)

export default router