interface WorkoutPlan {
  title: string;
  content: string;
}

const responseShape: WorkoutPlan = {
  title: 'string (title of the workout)',
  content: 'string (description of the workout)',
};

const createPrompt = (workoutDescription: string) =>
  JSON.stringify([
    {role: 'system', content: 'You are a workout planner assistant.'},
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

export type {WorkoutPlan};
export {createPrompt, responseShape};
