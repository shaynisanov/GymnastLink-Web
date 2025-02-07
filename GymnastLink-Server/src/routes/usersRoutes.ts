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
 *                 profileImageUrl:
 *                   type: string
 *                   description: The user's profile image URL
 *                   example: https://example.com/profile.jpg
 *       404:
 *         description: User not found
 *       400:
 *         description: Bad request
 */
router.get(
  '/:id',
  authMiddleware,
  usersController.getUserById.bind(usersController)
);

/**
 * @swagger
 * /users/profile-picture:
 *   put:
 *     summary: Update user profile picture
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The user ID
 *                 example: 60d0fe4f5311236168a109ca
 *               imageUrl:
 *                 type: string
 *                 description: The new profile image URL
 *                 example: https://example.com/new-profile.jpg
 *     responses:
 *       200:
 *         description: The updated user data
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
 *                 profileImageUrl:
 *                   type: string
 *                   description: The user's profile image URL
 *                   example: https://example.com/new-profile.jpg
 *       404:
 *         description: User not found
 *       400:
 *         description: Bad request
 */
router.put(
  '/profile-picture',
  authMiddleware,
  usersController.updateProfileImage.bind(usersController)
);

/**
 * @swagger
 * /users/username:
 *   put:
 *     summary: Update user username
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The user ID
 *                 example: 60d0fe4f5311236168a109ca
 *               userName:
 *                 type: string
 *                 description: The new username
 *                 example: new_username
 *     responses:
 *       200:
 *         description: The updated user data
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
 *                   example: new_username
 *                 profileImageUrl:
 *                   type: string
 *                   description: The user's profile image URL
 *                   example: https://example.com/profile.jpg
 *       404:
 *         description: User not found
 *       400:
 *         description: Bad request
 */
router.put(
  '/username',
  authMiddleware,
  usersController.updateUserName.bind(usersController)
);

export {router as userRouter};
