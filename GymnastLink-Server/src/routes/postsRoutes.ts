import * as express from 'express';
import postsController from '../controllers/postsController';
import {authMiddleware} from '../controllers/authController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: The Posts API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the post
 *         title:
 *           type: string
 *           description: The title of the post
 *         content:
 *           type: string
 *           description: The content of the post
 *         userId:
 *           type: string
 *           description: The owner id of the post
 *       example:
 *         _id: 245234t234234r234r23f4
 *         title: My First Post
 *         content: This is the content of my first post.
 *         userId: 324vt23r4tr234t245tbv45by
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     description: Retrieve a list of all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Server error
 */
router.get('/', authMiddleware, postsController.getAll.bind(postsController));

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     description: Retrieve a single post by its ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id',
  authMiddleware,
  postsController.getPostById.bind(postsController)
);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     description: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerUser: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the post
 *               content:
 *                 type: string
 *                 description: The content of the post
 *             required:
 *               - title
 *               - content
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad request (missing or invalid data)
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, postsController.create.bind(postsController));

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post by ID
 *     description: Update the details of a single post by its ID
 *     tags: [Posts]
 *     security:
 *       - bearerUser: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the post to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The updated title of the post
 *               content:
 *                 type: string
 *                 description: The updated content of the post
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       400:
 *         description: Bad request (invalid data)
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id',
  authMiddleware,
  postsController.updateItem.bind(postsController)
);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     description: Delete a single post by its ID
 *     tags: [Posts]
 *     security:
 *       - bearerUser: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/:id',
  authMiddleware,
  postsController.deleteItem.bind(postsController)
);

/**
 * @swagger
 * /posts/like:
 *   post:
 *     summary: like and unlike post by userId
 *     description: like and unlike single post by userId
 *     tags: [Posts]
 *     security:
 *       - bearerUser: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The ID of the post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post liked/unliked successfully
 *       400:
 *         description: Bad request (invalid data)
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.post(
  '/like/:postId',
  authMiddleware,
  postsController.handleLike.bind(postsController)
);

export {router as postRouter};
