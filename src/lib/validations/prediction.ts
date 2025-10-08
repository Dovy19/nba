import { z } from 'zod';

export const predictionSchema = z.object({
  eastConference: z.array(z.number()).length(15, "Eastern Conference must have exactly 15 teams"),
  westConference: z.array(z.number()).length(15, "Western Conference must have exactly 15 teams"),
  season: z.string().regex(/^\d{4}-\d{2}$/, "Invalid season format"),
});

export type PredictionInput = z.infer<typeof predictionSchema>;