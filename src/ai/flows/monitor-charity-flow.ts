'use server';

/**
 * @fileOverview Monitors the trustworthiness of a charity using AI.
 *
 * - monitorCharityTrustworthiness - A function that monitors the trustworthiness of a charity.
 * - MonitorCharityTrustworthinessInput - The input type for the monitorCharityTrustworthiness function.
 * - MonitorCharityTrustworthinessOutput - The return type for the monitorCharityTrustworthiness function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const MonitorCharityTrustworthinessInputSchema = z.object({
  charityName: z.string().describe('The name of the charity to monitor.'),
  charityDescription: z.string().describe('The description of the charity.'),
});

export type MonitorCharityTrustworthinessInput = z.infer<
  typeof MonitorCharityTrustworthinessInputSchema
>;

const MonitorCharityTrustworthinessOutputSchema = z.object({
  report: z.string().describe('A report on the trustworthiness of the charity.'),
  concerns: z.array(z.string()).describe('A list of potential issues or concerns about the charity.'),
});

export type MonitorCharityTrustworthinessOutput = z.infer<
  typeof MonitorCharityTrustworthinessOutputSchema
>;

export async function monitorCharityTrustworthiness(
  input: MonitorCharityTrustworthinessInput
): Promise<MonitorCharityTrustworthinessOutput> {
  return monitorCharityTrustworthinessFlow(input);
}

const monitorCharityPrompt = ai.definePrompt({
  name: 'monitorCharityPrompt',
  input: {
    schema: z.object({
      charityName: z.string().describe('The name of the charity to monitor.'),
      charityDescription: z.string().describe('The description of the charity.'),
    }),
  },
  output: {
    schema: z.object({
      report: z.string().describe('A report on the trustworthiness of the charity.'),
      concerns: z.array(z.string()).describe('A list of potential issues or concerns about the charity.'),
    }),
  },
  prompt: `You are an AI assistant that monitors the trustworthiness of charities.
  You will receive the name and description of a charity and search the web for any potential issues or concerns.
  You will then generate a report on the charity's trustworthiness and a list of any concerns.

  Charity Name: {{{charityName}}}
  Charity Description: {{{charityDescription}}}
  `,
});

const monitorCharityTrustworthinessFlow = ai.defineFlow<
  typeof MonitorCharityTrustworthinessInputSchema,
  typeof MonitorCharityTrustworthinessOutputSchema
>(
  {
    name: 'monitorCharityTrustworthinessFlow',
    inputSchema: MonitorCharityTrustworthinessInputSchema,
    outputSchema: MonitorCharityTrustworthinessOutputSchema,
  },
  async input => {
    const {output} = await monitorCharityPrompt(input);
    return output!;
  }
);
