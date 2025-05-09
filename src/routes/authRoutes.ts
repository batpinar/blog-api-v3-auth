import { Router, Request, Response } from "express";
import { registerController, loginController, refreshTokenController,logoutController, meController } from "../controllers/authController.js";
import { login } from "../models/authModel.js";
const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/refresh-token', refreshTokenController);
router.post('/logout', logoutController);
router.get('/me', meController)

export default router;
