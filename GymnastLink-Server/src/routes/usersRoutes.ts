import {Router} from 'express';
import usersController from '../controllers/usersController';
import {authMiddleware} from '../controllers/authController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: The User API
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The user ID
 *                   example: 60d0fe4f5311236168a109ca
 *                 userName:
 *                   type: string
 *                   description: The user's name
 *                   example: John Doe
 *                 profileImage:
 *                   type: string
 *                   description: The user's profile image URL
 *                   example: http://example.com/image.jpg
 *       404:
 *         description: User not found
 *       400:
 *         description: Bad request
 */
router.get('/:id', authMiddleware, usersController.getUserById);

export {router as userRouter};
