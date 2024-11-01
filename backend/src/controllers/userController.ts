import { UploadedFile } from "express-fileupload";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import { ErrorHandler } from "../middlewares/error";
import { PrismaClient } from '@prisma/client'
import { sign  } from 'jsonwebtoken';
import cloudinary from "cloudinary"
const prisma = new PrismaClient()

export const register = catchAsyncErrors(async (req , res , next)=>{

    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("please upload photo" , 400));
    }

    const avatar = req.files.avatar as UploadedFile;
    const allowedFormat = ["image/png" , "image/jpeg" , "image/webp"];


    if(!allowedFormat.includes(avatar.mimetype)){
        return next(new ErrorHandler("please provide photo in /png , /jpeg or /webp format only" , 400));
    }
    const {name , email , phone , password , role , education } =  req.body;

    if(!name || !email || !phone || !password || !role || !education || !avatar){

        return next(new ErrorHandler("please provide full details" , 400))
    }



    const user = await prisma.user.findFirst({
        where:{
            email:email
        }
    })
    

    if(user){
        return next(new ErrorHandler("user already exists" , 400));
    }

    const cloudinaryResponse = await cloudinary.v2.uploader.upload(
        avatar.tempFilePath
    )


    if(!cloudinaryResponse || cloudinaryResponse.error){

        console.log("cloudinary error:" , 
            cloudinaryResponse.error || "unknown error"
        )
    }

    const newUser = await prisma.user.create({
        data:{
            name:name,
            phone:phone,
            email:email,
            password:password,
            role:role,
            education:education,
            avatar:{
                public_id:cloudinaryResponse.public_id,
                url:cloudinaryResponse.url
            }
        }
    })

    

    res.status(200).json({
        success:true,
        message:"user registred successfully"
    })

})


export const login = catchAsyncErrors(async (req , res , next)=>{

    const {phone , password , role} = req.body;

    if(!phone || !password || !role){
        return next(new ErrorHandler("please provide phone , password and role" , 400));
    }

    const user = await prisma.user.findFirst({
        where:{
            phone:phone
        }
    })

    if(!user){
        return next(new ErrorHandler("user does not exists" , 400));
    }
   
    if(user.password != password){  
        return next(new ErrorHandler("password is incorrect" , 400));
    }
    if(user.role != role){
        return next(new ErrorHandler(`User is not registered for role ${role}` , 400));
    }

    
    const token = sign({ id: user.id, email: user.email }, process.env.JWT_SECRET! , { expiresIn: '1d' });

    // Set the token as a cookie
    res.cookie('token', token, {
        httpOnly: true, // Accessible only by the server
        maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    });


    
    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        token
    });
})


export const logout = catchAsyncErrors((req , res , next)=>{

    res.status(200).cookie("token","", {
        expires:new Date(0),
        httpOnly:true
    }).json({
        success: true,
        message: "User logged out successfully",
    })
})

export const getMyprofile = catchAsyncErrors((req , res , next)=>{

    const user = req.user;
    res.status(200).json({
        success:true,
        user
    })
})

export const getAllAuthor = catchAsyncErrors( async (req , res , next)=>{

    const authors = await prisma.user.findMany({
        where:{
            role:"AUTHOR"
        }
    })

    res.status(200).json({
        success:true,
        authors
    })
})



