import express, { Request, Response } from 'express';
import * as authController from '../controllers/auth.controller';

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', (req: Request, res: Response) => {
  authController.register(req, res);
});

/**
 * @route POST /api/auth/login
 * @desc Login user and get token
 * @access Public
 */
router.post('/login', (req: Request, res: Response) => {
  authController.login(req, res);
});

export default router;