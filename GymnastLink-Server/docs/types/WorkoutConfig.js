"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseShape = exports.createPrompt = void 0;
const responseShape = {
    title: 'string (title of the workout)',
    content: 'string (description of the workout)',
};
exports.responseShape = responseShape;
const createPrompt = (workoutDescription) => JSON.stringify([
    { role: 'system', content: 'You are a workout planner assistant.' },
    {
        role: 'user',
        content: `Plan a workout to fulfill the description: ${workoutDescription}.
        The workout plan should include the following details:
        - Target muscle groups
        - Exercises
        - Sets
        - Reps
        - Rest times
        - Overall workout goal (e.g., strength training, cardio, flexibility)
        
        Please organize the workout plan in a clear and structured format.
        dont use any special characters or emojis including *.

        Return the plan only as JSON of shape: ${JSON.stringify(responseShape)}`,
    },
]);
exports.createPrompt = createPrompt;
//# sourceMappingURL=WorkoutConfig.js.map