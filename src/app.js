import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app=express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors({
    origin:true,
    credentials:true,
    methods:['GET','POST','PUT','DELETE','PATCH'],
    allowedHeaders:['Content-Type','Authorization']
}))

//import routes

import userRoutes from './routes/user.routes.js'
import courseRoutes from './routes/course.routes.js'
app.use('/api/v1/users',userRoutes)
app.use('/api/v1/courses',courseRoutes)


export default app