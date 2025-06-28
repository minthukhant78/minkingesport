'use server';

/**
 * @fileOverview AI agent that suggests similar games based on the current game profile.
 *
 * - suggestSimilarGames - A function that suggests similar games.
 * - SuggestSimilarGamesInput - The input type for the suggestSimilarGames function.
 * - SuggestSimilarGamesOutput - The return type for the suggestSimilarGames function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSimilarGamesInputSchema = z.object({
  gameTitle: z.string().describe('The title of the game being viewed.'),
  gameDescription: z.string().describe('The description of the game.'),
  gameTags: z.array(z.string()).describe('An array of tags associated with the game.'),
});
export type SuggestSimilarGamesInput = z.infer<typeof SuggestSimilarGamesInputSchema>;

const SuggestSimilarGamesOutputSchema = z.object({
  suggestedGames: z.array(z.string()).describe('An array of suggested game titles.'),
  rationale: z.string().describe('The rationale for suggesting these games.'),
});
export type SuggestSimilarGamesOutput = z.infer<typeof SuggestSimilarGamesOutputSchema>;

export async function suggestSimilarGames(input: SuggestSimilarGamesInput): Promise<SuggestSimilarGamesOutput> {
  return suggestSimilarGamesFlow(input);
}

const gameSuggestionPrompt = ai.definePrompt({
  name: 'gameSuggestionPrompt',
  input: {schema: SuggestSimilarGamesInputSchema},
  output: {schema: SuggestSimilarGamesOutputSchema},
  prompt: `You are a game recommendation expert. Given the details of a game, you suggest other similar games that the user might enjoy.

  Game Title: {{{gameTitle}}}
  Game Description: {{{gameDescription}}}
  Game Tags: {{#each gameTags}}{{{this}}}, {{/each}}

  Suggest a list of similar games and provide a brief rationale for your suggestions.
  Format your response as a JSON object with "suggestedGames" and "rationale" fields. suggestedGames should be an array of strings.
  `,
});

const suggestSimilarGamesFlow = ai.defineFlow(
  {
    name: 'suggestSimilarGamesFlow',
    inputSchema: SuggestSimilarGamesInputSchema,
    outputSchema: SuggestSimilarGamesOutputSchema,
  },
  async input => {
    const {output} = await gameSuggestionPrompt(input);
    return output!;
  }
);
