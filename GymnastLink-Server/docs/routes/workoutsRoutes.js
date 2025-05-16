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
exports.workoutRouter = void 0;
const express = __importStar(require("express"));
const authController_1 = require("../controllers/authController");
const workoutController_1 = __importDefault(require("../controllers/workoutController"));
const router = express.Router();
exports.workoutRouter = router;
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
router.get('/', authController_1.authMiddleware, workoutController_1.default.getAllByUser.bind(workoutController_1.default));
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
router.post('/', authController_1.authMiddleware, workoutController_1.default.create.bind(workoutController_1.default));
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
router.post('/plan', authController_1.authMiddleware, workoutController_1.default.planWorkout.bind(workoutController_1.default));
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
router.delete('/:id', authController_1.authMiddleware, workoutController_1.default.deleteItem.bind(workoutController_1.default));
//# sourceMappingURL=workoutsRoutes.js.map