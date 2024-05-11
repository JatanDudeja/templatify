import { Router } from "express";
import app from "../app";
import verifyJWT from "../middlewares/auth.middlewares";
import { logoutUser, userLogin, getAccessTokenAndRefreshToken, getLoggedInUser, userSignup } from "../controllers/user.controllers";



const router = Router();

router.route('/signup').post(userSignup)
router.route("/login").post(userLogin)

// secured routes

router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refreshtoken").post(getAccessTokenAndRefreshToken)
router.route("/getCurrentUser").post(verifyJWT, getLoggedInUser)

export default router;