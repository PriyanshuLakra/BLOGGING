import { getAllAuthor, getMyprofile, login, logout, register } from "../controllers/userController";

import express from "express";
import { isAuthenticated, isAuthorised } from "../middlewares/auth";

const router = express.Router();

router.post("/register" , register);
router.post("/login" , login);
router.get("/logout" ,logout)
router.get("/getMyprofile" ,getMyprofile);
router.get("/getAllAuthor" ,  getAllAuthor )
export default router;