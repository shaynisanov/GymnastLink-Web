import * as express from 'express';
import {authMiddleware} from '../controllers/authController';
import workoutController from '../controllers/workoutController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Workouts
 *   description: The workouts managing API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Workout:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - userId
 *         - createdTime
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the workout
 *         title:
 *           type: string
 *           description: The title of the workout
 *         content:
 *           type: string
 *           description: The content of the workout
 *         userId:
 *           type: string
 *           description: The owner id of the workout
 *         createdTime:
 *           type: string
 *           description: The created time of the workout
 *       example:
 *         _id: 245234t234234r234r23f4
 *         title: My First Workout
 *         content: This is the content of my first workout.
 *         userId: 324vt23r4tr234t245tbv45by
 *         createdTime: 2021-09-01T12:00:00.000Z
 */

/**
 * @swagger
 * /workouts:
 *   get:
 *     summary: Get all workouts of the user
 *     description: Retrieve a list of all the workouts of the user
 *     tags: [Workouts]
 *     responses:
 *       200:
 *         description: A list of workouts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Workout'
 *       500:
 *         description: Server error
 */
router.get(
  '/',
  authMiddleware,
  workoutController.getAllByUser.bind(workoutController)
);

/**
 * @swagger
 * /workouts/:
 *   post:
 *     summary: Create a new workout
 *     description: Create a new workout
 *     tags: [Workouts]
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
 *                 description: The title of the workout
 *               content:
 *                 type: string
 *                 description: The content of the workout
 *               userId:
 *                 type: string
 *                 description: The owner id of the workout
 *               createdTime:
 *                 type: string
 *                 description: The created time of the workout
 *             required:
 *               - title
 *               - content
 *     responses:
 *       201:
 *         description: Workout created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workout'
 *       400:
 *         description: Bad request (missing or invalid data)
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  authMiddleware,
  workoutController.create.bind(workoutController)
);

/**
 * @swagger
 * /workouts/plan:
 *   post:
 *     summary: Plan a workout
 *     description: Plan a workout based on the description
 *     tags: [Workouts]
 *     security:
 *       - bearerUser: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: The description of the workout
 *             required:
 *               - description
 *     responses:
 *       200:
 *         description: Workout planned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workout'
 *       400:
 *         description: Bad request (missing or invalid data)
 *       500:
 *         description: Server error
 */
router.post(
  '/plan',
  authMiddleware,
  workoutController.planWorkout.bind(workoutController)
);

/**
 * @swagger
 * /workouts/{id}:
 *   delete:
 *     summary: Delete a workout by ID
 *     description: Delete a single workout by its ID
 *     tags: [Workouts]
 *     security:
 *       - bearerUser: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the workout to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workout deleted successfully
 *       404:
 *         description: Workout not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/:id',
  authMiddleware,
  workoutController.deleteItem.bind(workoutController)
);

export {router as workoutRouter};
