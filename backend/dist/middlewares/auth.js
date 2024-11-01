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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthorised = exports.isAuthenticated = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const client_1 = require("@prisma/client");
const error_1 = require("../middlewares/error");
const catchAsyncErrors_1 = require("./catchAsyncErrors");
const prisma = new client_1.PrismaClient();
exports.isAuthenticated = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token; // Get the token from the cookie
    if (!token) {
        return next(new error_1.ErrorHandler('Please log in to access this resource', 401));
    }
    // Verify token
    const decoded = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
    // Find the user in the database
    const user = yield prisma.user.findFirst({
        where: { id: decoded.id },
    });
    if (!user) {
        return next(new error_1.ErrorHandler('Invalid token or user does not exist', 401));
    }
    // Store user information in request
    req.user = user;
    next();
}));
const isAuthorised = (...roles) => {
    return (req, res, next) => {
        var _a, _b;
        if (!roles.includes((_a = req.user) === null || _a === void 0 ? void 0 : _a.role)) {
            return next(new error_1.ErrorHandler(`user with role ${(_b = req.user) === null || _b === void 0 ? void 0 : _b.role} cannot access this resourse`, 400));
        }
        next();
    };
};
exports.isAuthorised = isAuthorised;
