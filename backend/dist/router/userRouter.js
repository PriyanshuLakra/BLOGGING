"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = require("../controllers/userController");
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.post("/register", userController_1.register);
router.post("/login", userController_1.login);
router.get("/logout", auth_1.isAuthenticated, userController_1.logout);
router.get("/getMyprofile", auth_1.isAuthenticated, userController_1.getMyprofile);
router.get("/getAllAuthor", auth_1.isAuthenticated, userController_1.getAllAuthor);
exports.default = router;
