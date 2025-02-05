import {Router} from 'express';
import commentsController from '../controllers/commentsController';
import {authMiddleware} from '../controllers/authController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: The Comments API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - postId
 *         - content
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the comment
 *         postId:
 *           type: string
 *           description: The id of the post that the comment belongs to
 *         content:
 *           type: string
 *           description: The content of the comment
 *       example:
 *         _id: 62a1c60e8d0a5c6fa1cdbad7
 *         postId: 62a1c60e8d0a5c6fa1cdbad6
 *         content: This is a comment on the post.
 */

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments
 *     description: Retrieve a list of all comments
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: List of comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Server error
 */
router.get(
  '/',
  authMiddleware,
  commentsController.getAll.bind(commentsController)
);

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     description: Create a new comment on a post
 *     tags: [Comments]
 *     security:
 *       - bearerUser: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *                 description: The ID of the post to which the comment belongs
 *               content:
 *                 type: string
 *                 description: The content of the comment
 *             required:
 *               - postId
 *               - content
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request (missing or invalid data)
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  authMiddleware,
  commentsController.create.bind(commentsController)
);

/**
 * @swagger
 * /comments/count:
 *  get:
 *   summary: Get comment count by post ID
 *   description: Retrieve the number of comments that belong to a post
 *   tags: [Comments]
 *   parameters:
 *     - in: query
 *       name: postId
 *       schema:
 *         type: string
 *       required: true
 *       description: The ID of the post whose comments are to be counted
 *   responses:
 *     200:
 *       description: Comment count retrieved successfully
 *     400:
 *       description: Bad request (missing or invalid data)
 *     500:
 *       description: Server error
 */
router.get(
  '/count',
  authMiddleware,
  commentsController.getCommentCount.bind(commentsController)
);

/**
 * @swagger
 * /comments/:
 *   delete:
 *     summary: Delete comments by post ID
 *     description: Delete all comments that belong to a post
 *     tags: [Comments]
 *     parameters:
 *       - in: query
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post whose comments are to be deleted
 *     responses:
 *       200:
 *         description: Comments deleted successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/',
  authMiddleware,
  commentsController.deleteCommentsByPostId.bind(commentsController)
);

export {router as commentRouter};
