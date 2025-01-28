interface WorkoutPlan {
    title: string;
    content: string;
}

const responseShape: WorkoutPlan = {
    title: 'string (title of the workout)',
    content: 'string (description of the workout)',
};
};

const createPrompt = (workoutDescription: string) => JSON.stringify([
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

        Please organize the workout plan in a clear and structured format,
        every detail in the above write on a separate line.
        when there are multiple exercises, sets, or reps, please separate them with commas.
        when there is a topic change, please use a new line.
        dont use any special characters or emojis.

        Example of a detailed workout description:
        "I want a strength training workout focusing on upper body.
         Include exercises like bench press, shoulder press, and bicep curls.
         Do 3 sets of 10 reps for each exercise with 1 minute rest between sets."

        Return the plan only as JSON of shape: ${JSON.stringify(responseShape)}`,
    },
]);

export type { WorkoutPlan };
export { createPrompt, responseShape };