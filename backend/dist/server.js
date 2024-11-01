"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { server } from "typescript";
// import app from "./app";
// const PORT = process.env.PORT || 4000;
// app.listen(PORT , ()=>{
//     console.log(`server running on port ${PORT}`)
// })
const app_1 = __importDefault(require("./app"));
const http_1 = require("http"); // Import 'http' from Node.js
const cloudinary_1 = __importDefault(require("cloudinary"));
const PORT = process.env.PORT || 4000;
// Create an HTTP server explicitly
const server = (0, http_1.createServer)(app_1.default);
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// // Gracefully shutdown the server on SIGTERM or SIGINT
// process.on('SIGTERM', () => {
//   console.log('SIGTERM received. Shutting down gracefully.');
//   server.close(() => {
//     console.log('Process terminated');
//   });
// });
// process.on('SIGINT', () => {
//   console.log('SIGINT received. Shutting down gracefully.');
//   server.close(() => {
//     console.log('Process terminated');
//   });
// });
