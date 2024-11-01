import dotenv from "dotenv";


// import { server } from "typescript";
// import app from "./app";



// const PORT = process.env.PORT || 4000;
// app.listen(PORT , ()=>{
//     console.log(`server running on port ${PORT}`)
// })


import app from './app';
import { createServer } from 'http'; // Import 'http' from Node.js
import cloudinary from "cloudinary";
const PORT = process.env.PORT || 4000;

// Create an HTTP server explicitly
const server = createServer(app);


cloudinary.v2.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET
})
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

