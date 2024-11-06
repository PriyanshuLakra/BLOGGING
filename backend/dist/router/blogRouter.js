"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const blogController_1 = require("../controllers/blogController");
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.post("/blogPost", auth_1.isAuthenticated, (0, auth_1.isAuthorised)("AUTHOR"), blogController_1.blogPost);
router.delete("/deleteBlog/:id", auth_1.isAuthenticated, (0, auth_1.isAuthorised)("AUTHOR"), blogController_1.deleteBlog);
router.get("/getAllblogs", blogController_1.getAllblogs);
router.get("/getBlog/:id", auth_1.isAuthenticated, blogController_1.getBlog);
router.get("/getmyBogs", auth_1.isAuthenticated, (0, auth_1.isAuthorised)("AUTHOR"), blogController_1.Myblogs);
router.post("/updateBlog/:id", auth_1.isAuthenticated, (0, auth_1.isAuthorised)("AUTHOR"), blogController_1.updateBlog);
exports.default = router;
