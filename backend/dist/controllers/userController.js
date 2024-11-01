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
exports.getAllAuthor = exports.getMyprofile = exports.logout = exports.login = exports.register = void 0;
const catchAsyncErrors_1 = require("../middlewares/catchAsyncErrors");
const error_1 = require("../middlewares/error");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = require("jsonwebtoken");
const cloudinary_1 = __importDefault(require("cloudinary"));
const prisma = new client_1.PrismaClient();
exports.register = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new error_1.ErrorHandler("please upload photo", 400));
    }
    const avatar = req.files.avatar;
    const allowedFormat = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormat.includes(avatar.mimetype)) {
        return next(new error_1.ErrorHandler("please provide photo in /png , /jpeg or /webp format only", 400));
    }
    const { name, email, phone, password, role, education } = req.body;
    if (!name || !email || !phone || !password || !role || !education || !avatar) {
        return next(new error_1.ErrorHandler("please provide full details", 400));
    }
    const user = yield prisma.user.findFirst({
        where: {
            email: email
        }
    });
    if (user) {
        return next(new error_1.ErrorHandler("user already exists", 400));
    }
    const cloudinaryResponse = yield cloudinary_1.default.v2.uploader.upload(avatar.tempFilePath);
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.log("cloudinary error:", cloudinaryResponse.error || "unknown error");
    }
    const newUser = yield prisma.user.create({
        data: {
            name: name,
            phone: phone,
            email: email,
            password: password,
            role: role,
            education: education,
            avatar: {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.url
            }
        }
    });
    res.status(200).json({
        success: true,
        message: "user registred successfully"
    });
}));
exports.login = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone, password, role } = req.body;
    if (!phone || !password || !role) {
        return next(new error_1.ErrorHandler("please provide phone , password and role", 400));
    }
    const user = yield prisma.user.findFirst({
        where: {
            phone: phone
        }
    });
    if (!user) {
        return next(new error_1.ErrorHandler("user does not exists", 400));
    }
    if (user.password != password) {
        return next(new error_1.ErrorHandler("password is incorrect", 400));
    }
    if (user.role != role) {
        return next(new error_1.ErrorHandler(`User is not registered for role ${role}`, 400));
    }
    const token = (0, jsonwebtoken_1.sign)({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
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
}));
exports.logout = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => {
    res.status(200).cookie("token", "", {
        expires: new Date(0),
        httpOnly: true
    }).json({
        success: true,
        message: "User logged out successfully",
    });
});
exports.getMyprofile = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user
    });
});
exports.getAllAuthor = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authors = yield prisma.user.findMany({
        where: {
            role: "AUTHOR"
        }
    });
    res.status(200).json({
        success: true,
        authors
    });
}));
