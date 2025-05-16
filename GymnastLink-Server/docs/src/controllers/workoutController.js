"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseController_1 = require("./baseController");
const WorkoutsModel_1 = require("../models/WorkoutsModel");
const WorkoutConfig_1 = require("../types/WorkoutConfig");
const generative_ai_1 = require("@google/generative-ai");
class WorkoutController extends baseController_1.BaseController {
    constructor() {
        super(WorkoutsModel_1.workoutModel);
    }
    generateWorkoutPlan(prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            const aiApiKey = process.env.AI_API_KEY;
            if (!aiApiKey) {
                throw new Error('AI_API_KEY is not defined.');
            }
            const genAI = new generative_ai_1.GoogleGenerativeAI(aiApiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const result = yield model.generateContent(prompt);
            try {
                return JSON.parse(result.response.text().split('json')[1].split('```')[0]);
            }
            catch (e) {
                throw new Error('Failed to generate trip plan. Error: ' + e);
            }
        });
    }
    planWorkout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const workoutDescription = req.body.description;
            try {
                const workoutPlanPrompt = (0, WorkoutConfig_1.createPrompt)(workoutDescription);
                const workoutPlan = yield this.generateWorkoutPlan(workoutPlanPrompt);
                if (!workoutPlan) {
                    res.status(500).json({ error: 'Failed to generate workout plans.' });
                }
                res.json(workoutPlan);
            }
            catch (error) {
                console.error('Error:', error.message);
                res.status(500).json({ error: 'Failed to plan the workout.' });
            }
        });
    }
    getAllByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = yield this.model.find({ userId: req.body.userId });
                res.send(items);
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
}
exports.default = new WorkoutController();
//# sourceMappingURL=workoutController.js.map