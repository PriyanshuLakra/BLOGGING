
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";

import cloudinary from "cloudinary"
import { ErrorHandler } from "../middlewares/error";
import { promises } from "dns";
import { Prisma, PrismaClient } from "@prisma/client";
import { UploadedFile } from "express-fileupload";
import { title } from "process";
import { JsonValue } from "@prisma/client/runtime/library";
const prisma = new PrismaClient()


export const blogPost = catchAsyncErrors(async (req, res, next) => {


    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("please provide a image for your Blog", 400));
    }


    const { mainImage, paraoneImage, paratwoImage, parathreeImage } = req.files;


    if (!mainImage) {
        return next(new ErrorHandler("please provide a image for your Blog 2", 400));
    }

    const { title, intro, mainContent, paraOneDescription, paraOneTitle, paraTwoDescription, paraTwoTitle, paraThreeDescription, paraThreeTitle, category, } = req.body

    const createdById = req.user?.id

    const authorName = req.user?.name

    const createdOn = req.user?.createdOn

    const authorAvatar = req.user?.avatar

    if (!title || !category || !intro || !mainContent) {
        return next(new ErrorHandler("please provide title , category , mainContent and  intro for blog ", 400));
    }

    const getFilePath = (file: UploadedFile | UploadedFile[] | undefined): string | null => {
        if (!file) return null;
        // If file is an array, use the first file, otherwise use the file directly
        return Array.isArray(file) ? file[0].tempFilePath : file.tempFilePath;
    };

    const mainImagePath = getFilePath(mainImage);
    const paraoneImagePath = getFilePath(paraoneImage);
    const paratwoImagePath = getFilePath(paratwoImage);
    const parathreeImagePath = getFilePath(parathreeImage);

    const uploadPromises = [
        mainImagePath ? cloudinary.v2.uploader.upload(mainImagePath) : Promise.resolve(null), // Main image
        paraoneImagePath ? cloudinary.v2.uploader.upload(paraoneImagePath) : Promise.resolve(null),
        paratwoImagePath ? cloudinary.v2.uploader.upload(paratwoImagePath) : Promise.resolve(null),
        parathreeImagePath ? cloudinary.v2.uploader.upload(parathreeImagePath) : Promise.resolve(null)
    ];

    const [mainImageRes, paraoneImageRes, paratwoImageRes, parathreeImageRes] = await Promise.all(uploadPromises)


    if ((!mainImageRes || mainImageRes.error) && (!paraoneImageRes || paraoneImageRes.error) && (!parathreeImageRes || parathreeImageRes.error) && (!paratwoImageRes || paratwoImageRes.error)) {

        return next(new ErrorHandler("error occur while uploading images", 400));
    }


    const BlogData: Prisma.BlogCreateInput = {
        title,
        intro,
        mainContent,
        paraOneDescription,
        paraOneTitle,
        paraTwoDescription,
        paraTwoTitle,
        paraThreeDescription,
        paraThreeTitle,
        category,
        authorName,
        createdBy: { connect: { id: createdById } }, // Correctly link the user (createdBy)
        createdOn,
        authorAvatar: {
            authorAvatar
        },
        mainImage: {
            public_id: mainImageRes?.public_id,
            url: mainImageRes?.secure_url,
        },
        paraOneImage: paraoneImageRes
            ? {
                public_id: paraoneImageRes.public_id,
                url: paraoneImageRes.secure_url,
            }
            : undefined,
        paraTwoImage: paratwoImageRes
            ? {
                public_id: paratwoImageRes.public_id,
                url: paratwoImageRes.secure_url,
            }
            : undefined,
        paraThreeImage: parathreeImageRes
            ? {
                public_id: parathreeImageRes.public_id,
                url: parathreeImageRes.secure_url,
            }
            : undefined,
    };

    // Save the blog in the database
    const blog = await prisma.blog.create({
        data: BlogData, // BlogData is now a valid Prisma.BlogCreateInput
    });



    res.status(200).json({
        success: true,
        message: "Blog created",
        blog
    })

})

export const deleteBlog = catchAsyncErrors(async (req, res, next) => {


    const toDelete = req.params.id
    console.log(toDelete)
    const blog = await prisma.blog.findFirst({
        where: {
            id: Number(toDelete)
        }
    })

    if (!blog) {
        return next(new ErrorHandler("the blog does not exists", 400));
    }

    await prisma.blog.delete({
        where: {
            id: Number(toDelete)
        }
    })

    res.status(200).json({
        success: true,
        message: "blog delete successfully"
    })

})


export const getAllblogs = catchAsyncErrors(async (req, res, next) => {

    const blogs = await prisma.blog.findMany({});

    res.status(200).json({
        success: true,
        blogs
    })
})

export const getBlog = catchAsyncErrors(async (req, res, next) => {


    const toGet = req.params.id;

    const blog = await prisma.blog.findFirst({
        where: {
            id: Number(toGet)
        }
    })


    if (!blog) {
        return next(new ErrorHandler("no blog found ", 400));
    }

    res.status(200).json({
        success: "true",
        blog
    })


})

export const Myblogs = catchAsyncErrors(async (req, res, next) => {

    const id = req.user?.id;
    console.log(id);
    const blogs = await prisma.blog.findMany({
        where: {
            createdById: Number(id)
        }
    })

    if (!blogs) {
        return next(new ErrorHandler("you have not published any blogs", 400));
    }


    res.status(200).json({
        success: true,
        blogs

    })
})

export const updateBlog = catchAsyncErrors(async (req, res, next) => {

    const id = req.params.id;

    const blog = await prisma.blog.findFirst({
        where: {
            id: Number(id)
        }
    })

    if (!blog) {
        next(new ErrorHandler("bog not found", 400));
    }


    const newBlog = {
        title: req.body.title,
        intro: req.body.intro,
        mainContent: req.body.mainContent,
        category: req.body.category,
        paraOneDescription: req.body.paraOneDescription,
        paraOneTitle: req.body.paraOneTitle,
        paraTwoDescription: req.body.paraTwoDescription,
        paraTwoTitle: req.body.paraTwoTitle,
        paraThreeDescription: req.body.paraThreeDescription,
        paraThreeTitle: req.body.paraThreeTitle
    }

    type ImageData = {
        public_id: string;
        url: string;
    };
    if (req.files) {
        const { mainImage, paraOneImage, paraTwoImage, paraThreeImage } = req.files
        if (mainImage) {
            const prevmainImage = blog?.mainImage;
            let prevImageData: ImageData | null = null;
            if (prevmainImage && typeof prevmainImage === 'object' && prevmainImage !== null) {
                // Handle prevmainImage as JsonObject
                prevImageData = prevmainImage as ImageData; // already an object
            }
            if (prevImageData && prevImageData.public_id) {
                cloudinary.v2.uploader.destroy(prevImageData.public_id);
            } else {
                console.log("No previous image data available or public_id not found.");
            }
        }

        if (paraOneImage) {
            const prevparaOneImage = blog?.paraOneImage;
            let prevImageData: ImageData | null = null;
            if (prevparaOneImage && typeof prevparaOneImage === 'object' && prevparaOneImage != null) {
                prevImageData = prevparaOneImage as ImageData;
            }
            if (prevImageData && prevImageData.public_id) {
                cloudinary.v2.uploader.destroy(prevImageData.public_id);
            }
        }
        if (paraTwoImage) {
            const prevparaTwoImage = blog?.paraTwoImage;
            let prevImageData: ImageData | null = null;
            if (prevparaTwoImage && typeof prevparaTwoImage === 'object' && prevparaTwoImage != null) {
                prevImageData = prevparaTwoImage as ImageData;
            }
            if (prevImageData && prevImageData.public_id) {
                cloudinary.v2.uploader.destroy(prevImageData.public_id);
            }
        }

        if (paraThreeImage) {
            const prevparaThreeImage = blog?.paraThreeImage;
            let prevImageData: ImageData | null = null;
            if (prevparaThreeImage && typeof prevparaThreeImage === 'object' && prevparaThreeImage != null) {
                prevImageData = prevparaThreeImage as ImageData;
            }
            if (prevImageData && prevImageData.public_id) {
                cloudinary.v2.uploader.destroy(prevImageData.public_id);
            }
        }

        const getFilePath = (file: UploadedFile | UploadedFile[] | undefined): string | null => {
            if (!file) return null;
            // If file is an array, use the first file, otherwise use the file directly
            return Array.isArray(file) ? file[0].tempFilePath : file.tempFilePath;
        };

        const mainImagePath = getFilePath(mainImage);
        const paraoneImagePath = getFilePath(paraOneImage);
        const paratwoImagePath = getFilePath(paraTwoImage);
        const parathreeImagePath = getFilePath(paraThreeImage);

        const uploadPromises = [
            mainImagePath ? cloudinary.v2.uploader.upload(mainImagePath) : Promise.resolve(null), // Main image
            paraoneImagePath ? cloudinary.v2.uploader.upload(paraoneImagePath) : Promise.resolve(null),
            paratwoImagePath ? cloudinary.v2.uploader.upload(paratwoImagePath) : Promise.resolve(null),
            parathreeImagePath ? cloudinary.v2.uploader.upload(parathreeImagePath) : Promise.resolve(null)
        ];

        const [mainImageRes, paraoneImageRes, paratwoImageRes, parathreeImageRes] = await Promise.all(uploadPromises)


        if ((!mainImageRes || mainImageRes.error) && (!paraoneImageRes || paraoneImageRes.error) && (!parathreeImageRes || parathreeImageRes.error) && (!paratwoImageRes || paratwoImageRes.error)) {

            return next(new ErrorHandler("error occur while uploading images", 400));
        }

        if(mainImageRes){
            await prisma.blog.update({
                where:{
                    id:Number(id)
                },
                data:{
                    mainImage: {
                        public_id: mainImageRes?.public_id,
                        url: mainImageRes?.secure_url,
                    }
                }
            })
        }
        if(paraoneImageRes){
            await prisma.blog.update({
                where:{
                    id:Number(id)
                },
                data:{
                    paraOneImage: {
                        public_id: paraoneImageRes?.public_id,
                        url: paraoneImageRes?.secure_url,
                    }
                }
            })
        }
        if(paratwoImageRes){
            await prisma.blog.update({
                where:{
                    id:Number(id)
                },
                data:{
                    paraTwoImage: {
                        public_id: paratwoImageRes?.public_id,
                        url: paratwoImageRes?.secure_url,
                    }
                }
            })
        }
        if(parathreeImageRes){
            await prisma.blog.update({
                where:{
                    id:Number(id)
                },
                data:{
                    paraThreeImage: {
                        public_id: parathreeImageRes?.public_id,
                        url: parathreeImageRes?.secure_url,
                    }
                }
            })
        }

    }


    const BLOG = await prisma.blog.update({
        where:{
           id:Number(id)
        },
        data:{
            ...newBlog
        }
    })

    res.status(200).json({
        success:true,
        BLOG
    })

})




