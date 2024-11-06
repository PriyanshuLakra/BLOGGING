import { blogPost, deleteBlog, getAllblogs, getBlog, Myblogs, updateBlog } from "../controllers/blogController";
import { register } from "../controllers/userController";

import express from "express";
import { isAuthenticated, isAuthorised } from "../middlewares/auth";

const router = express.Router();


router.post("/blogPost" , isAuthenticated , isAuthorised("AUTHOR") ,blogPost);
router.delete("/deleteBlog/:id" ,isAuthenticated , isAuthorised("AUTHOR") , deleteBlog);
router.get("/getAllblogs" , getAllblogs);
router.get("/getBlog/:id" , isAuthenticated, getBlog)
router.get("/getmyBogs" , isAuthenticated , isAuthorised("AUTHOR"), Myblogs);
router.post("/updateBlog/:id" , isAuthenticated , isAuthorised("AUTHOR") , updateBlog);






export default router;