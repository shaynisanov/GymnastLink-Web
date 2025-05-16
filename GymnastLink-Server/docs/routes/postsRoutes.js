"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const express = __importStar(require("express"));
const postsController_1 = __importDefault(require("../controllers/postsController"));
const authController_1 = require("../controllers/authController");
const router = express.Router();
exports.postRouter = router;
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
router.get('/', authController_1.authMiddleware, postsController_1.default.getAll.bind(postsController_1.default));
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
router.get('/:id', authController_1.authMiddleware, postsController_1.default.getPostById.bind(postsController_1.default));
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
router.post('/', authController_1.authMiddleware, postsController_1.default.create.bind(postsController_1.default));
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
router.put('/:id', authController_1.authMiddleware, postsController_1.default.updateItem.bind(postsController_1.default));
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
router.delete('/:id', authController_1.authMiddleware, postsController_1.default.deleteItem.bind(postsController_1.default));
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
router.post('/like/:postId', authController_1.authMiddleware, postsController_1.default.handleLike.bind(postsController_1.default));
//# sourceMappingURL=postsRoutes.js.map