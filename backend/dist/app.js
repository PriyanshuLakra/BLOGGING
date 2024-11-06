"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_1 = require("./middlewares/error");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
// import blogRouter from "../src/router/blogRouter"
const userRouter_1 = __importDefault(require("./router/userRouter"));
const blogRouter_1 = __importDefault(require("./router/blogRouter"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// app.use(cors({
//     origin:[process.env.FRONTEND_URL ?? ""],
//     methods:["GET" , "PUT" , "DELETE" , "POST"],
//     credentials:true
// }))
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
dotenv_1.default.config({ path: './config/config.env' });
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_fileupload_1.default)({
    useTempFiles: true,
    tempFileDir: "/tmp/" // Max file size limit (5MB in this case)
}));
app.use("/api/v1/user", userRouter_1.default);
app.use("/api/v1/blog", blogRouter_1.default);
// app.use(errorMiddleware);
app.use(error_1.errorMiddleware);
exports.default = app;
