"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlog = exports.Myblogs = exports.getBlog = exports.getAllblogs = exports.deleteBlog = exports.blogPost = void 0;
const catchAsyncErrors_1 = require("../middlewares/catchAsyncErrors");
const cloudinary_1 = __importDefault(require("cloudinary"));
const error_1 = require("../middlewares/error");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.blogPost = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new error_1.ErrorHandler("please provide a image for your Blog", 400));
    }
    const { mainImage, paraoneImage, paratwoImage, parathreeImage } = req.files;
    if (!mainImage) {
        return next(new error_1.ErrorHandler("please provide a image for your Blog 2", 400));
    }
    const { title, intro, mainContent, paraOneDescription, paraOneTitle, paraTwoDescription, paraTwoTitle, paraThreeDescription, paraThreeTitle, category, } = req.body;
    const createdById = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const authorName = (_b = req.user) === null || _b === void 0 ? void 0 : _b.name;
    const createdOn = (_c = req.user) === null || _c === void 0 ? void 0 : _c.createdOn;
    const authorAvatar = (_d = req.user) === null || _d === void 0 ? void 0 : _d.avatar;
    if (!title || !category || !intro || !mainContent) {
        return next(new error_1.ErrorHandler("please provide title , category , mainContent and  intro for blog ", 400));
    }
    const getFilePath = (file) => {
        if (!file)
            return null;
        // If file is an array, use the first file, otherwise use the file directly
        return Array.isArray(file) ? file[0].tempFilePath : file.tempFilePath;
    };
    const mainImagePath = getFilePath(mainImage);
    const paraoneImagePath = getFilePath(paraoneImage);
    const paratwoImagePath = getFilePath(paratwoImage);
    const parathreeImagePath = getFilePath(parathreeImage);
    const uploadPromises = [
        mainImagePath ? cloudinary_1.default.v2.uploader.upload(mainImagePath) : Promise.resolve(null), // Main image
        paraoneImagePath ? cloudinary_1.default.v2.uploader.upload(paraoneImagePath) : Promise.resolve(null),
        paratwoImagePath ? cloudinary_1.default.v2.uploader.upload(paratwoImagePath) : Promise.resolve(null),
        parathreeImagePath ? cloudinary_1.default.v2.uploader.upload(parathreeImagePath) : Promise.resolve(null)
    ];
    const [mainImageRes, paraoneImageRes, paratwoImageRes, parathreeImageRes] = yield Promise.all(uploadPromises);
    if ((!mainImageRes || mainImageRes.error) && (!paraoneImageRes || paraoneImageRes.error) && (!parathreeImageRes || parathreeImageRes.error) && (!paratwoImageRes || paratwoImageRes.error)) {
        return next(new error_1.ErrorHandler("error occur while uploading images", 400));
    }
    const BlogData = {
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
            public_id: mainImageRes === null || mainImageRes === void 0 ? void 0 : mainImageRes.public_id,
            url: mainImageRes === null || mainImageRes === void 0 ? void 0 : mainImageRes.secure_url,
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
    const blog = yield prisma.blog.create({
        data: BlogData, // BlogData is now a valid Prisma.BlogCreateInput
    });
    res.status(200).json({
        success: true,
        message: "Blog created",
        blog
    });
}));
exports.deleteBlog = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const toDelete = req.params.id;
    console.log(toDelete);
    const blog = yield prisma.blog.findFirst({
        where: {
            id: Number(toDelete)
        }
    });
    if (!blog) {
        return next(new error_1.ErrorHandler("the blog does not exists", 400));
    }
    yield prisma.blog.delete({
        where: {
            id: Number(toDelete)
        }
    });
    res.status(200).json({
        success: true,
        message: "blog delete successfully"
    });
}));
exports.getAllblogs = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const blogs = yield prisma.blog.findMany({});
    res.status(200).json({
        success: true,
        blogs
    });
}));
exports.getBlog = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const toGet = req.params.id;
    const blog = yield prisma.blog.findFirst({
        where: {
            id: Number(toGet)
        }
    });
    if (!blog) {
        return next(new error_1.ErrorHandler("no blog found ", 400));
    }
    res.status(200).json({
        success: "true",
        blog
    });
}));
exports.Myblogs = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const id = (_e = req.user) === null || _e === void 0 ? void 0 : _e.id;
    console.log(id);
    const blogs = yield prisma.blog.findMany({
        where: {
            createdById: Number(id)
        }
    });
    if (!blogs) {
        return next(new error_1.ErrorHandler("you have not published any blogs", 400));
    }
    res.status(200).json({
        success: true,
        blogs
    });
}));
exports.updateBlog = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const blog = yield prisma.blog.findFirst({
        where: {
            id: Number(id)
        }
    });
    if (!blog) {
        next(new error_1.ErrorHandler("bog not found", 400));
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
    };
    if (req.files) {
        const { mainImage, paraOneImage, paraTwoImage, paraThreeImage } = req.files;
        if (mainImage) {
            const prevmainImage = blog === null || blog === void 0 ? void 0 : blog.mainImage;
            let prevImageData = null;
            if (prevmainImage && typeof prevmainImage === 'object' && prevmainImage !== null) {
                // Handle prevmainImage as JsonObject
                prevImageData = prevmainImage; // already an object
            }
            if (prevImageData && prevImageData.public_id) {
                cloudinary_1.default.v2.uploader.destroy(prevImageData.public_id);
            }
            else {
                console.log("No previous image data available or public_id not found.");
            }
        }
        if (paraOneImage) {
            const prevparaOneImage = blog === null || blog === void 0 ? void 0 : blog.paraOneImage;
            let prevImageData = null;
            if (prevparaOneImage && typeof prevparaOneImage === 'object' && prevparaOneImage != null) {
                prevImageData = prevparaOneImage;
            }
            if (prevImageData && prevImageData.public_id) {
                cloudinary_1.default.v2.uploader.destroy(prevImageData.public_id);
            }
        }
        if (paraTwoImage) {
            const prevparaTwoImage = blog === null || blog === void 0 ? void 0 : blog.paraTwoImage;
            let prevImageData = null;
            if (prevparaTwoImage && typeof prevparaTwoImage === 'object' && prevparaTwoImage != null) {
                prevImageData = prevparaTwoImage;
            }
            if (prevImageData && prevImageData.public_id) {
                cloudinary_1.default.v2.uploader.destroy(prevImageData.public_id);
            }
        }
        if (paraThreeImage) {
            const prevparaThreeImage = blog === null || blog === void 0 ? void 0 : blog.paraThreeImage;
            let prevImageData = null;
            if (prevparaThreeImage && typeof prevparaThreeImage === 'object' && prevparaThreeImage != null) {
                prevImageData = prevparaThreeImage;
            }
            if (prevImageData && prevImageData.public_id) {
                cloudinary_1.default.v2.uploader.destroy(prevImageData.public_id);
            }
        }
        const getFilePath = (file) => {
            if (!file)
                return null;
            // If file is an array, use the first file, otherwise use the file directly
            return Array.isArray(file) ? file[0].tempFilePath : file.tempFilePath;
        };
        const mainImagePath = getFilePath(mainImage);
        const paraoneImagePath = getFilePath(paraOneImage);
        const paratwoImagePath = getFilePath(paraTwoImage);
        const parathreeImagePath = getFilePath(paraThreeImage);
        const uploadPromises = [
            mainImagePath ? cloudinary_1.default.v2.uploader.upload(mainImagePath) : Promise.resolve(null), // Main image
            paraoneImagePath ? cloudinary_1.default.v2.uploader.upload(paraoneImagePath) : Promise.resolve(null),
            paratwoImagePath ? cloudinary_1.default.v2.uploader.upload(paratwoImagePath) : Promise.resolve(null),
            parathreeImagePath ? cloudinary_1.default.v2.uploader.upload(parathreeImagePath) : Promise.resolve(null)
        ];
        const [mainImageRes, paraoneImageRes, paratwoImageRes, parathreeImageRes] = yield Promise.all(uploadPromises);
        if ((!mainImageRes || mainImageRes.error) && (!paraoneImageRes || paraoneImageRes.error) && (!parathreeImageRes || parathreeImageRes.error) && (!paratwoImageRes || paratwoImageRes.error)) {
            return next(new error_1.ErrorHandler("error occur while uploading images", 400));
        }
        if (mainImageRes) {
            yield prisma.blog.update({
                where: {
                    id: Number(id)
                },
                data: {
                    mainImage: {
                        public_id: mainImageRes === null || mainImageRes === void 0 ? void 0 : mainImageRes.public_id,
                        url: mainImageRes === null || mainImageRes === void 0 ? void 0 : mainImageRes.secure_url,
                    }
                }
            });
        }
        if (paraoneImageRes) {
            yield prisma.blog.update({
                where: {
                    id: Number(id)
                },
                data: {
                    paraOneImage: {
                        public_id: paraoneImageRes === null || paraoneImageRes === void 0 ? void 0 : paraoneImageRes.public_id,
                        url: paraoneImageRes === null || paraoneImageRes === void 0 ? void 0 : paraoneImageRes.secure_url,
                    }
                }
            });
        }
        if (paratwoImageRes) {
            yield prisma.blog.update({
                where: {
                    id: Number(id)
                },
                data: {
                    paraTwoImage: {
                        public_id: paratwoImageRes === null || paratwoImageRes === void 0 ? void 0 : paratwoImageRes.public_id,
                        url: paratwoImageRes === null || paratwoImageRes === void 0 ? void 0 : paratwoImageRes.secure_url,
                    }
                }
            });
        }
        if (parathreeImageRes) {
            yield prisma.blog.update({
                where: {
                    id: Number(id)
                },
                data: {
                    paraThreeImage: {
                        public_id: parathreeImageRes === null || parathreeImageRes === void 0 ? void 0 : parathreeImageRes.public_id,
                        url: parathreeImageRes === null || parathreeImageRes === void 0 ? void 0 : parathreeImageRes.secure_url,
                    }
                }
            });
        }
    }
    const BLOG = yield prisma.blog.update({
        where: {
            id: Number(id)
        },
        data: Object.assign({}, newBlog)
    });
    res.status(200).json({
        success: true,
        BLOG
    });
}));
