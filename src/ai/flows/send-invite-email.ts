'use server';

/**
 * @fileOverview An AI agent that generates and sends an invitation email.
 *
 * - sendInviteEmail - A function that generates and sends an invitation email.
 * - SendInviteEmailInput - The input type for the sendInviteEmail function.
 * - SendInviteEmailOutput - The return type for the sendInviteEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { Resend } from 'resend';

const SendInviteEmailInputSchema = z.object({
  recipientEmail: z.string().email().describe("The email address of the person being invited."),
  inviteLink: z.string().url().describe("The sign-up link to include in the invitation."),
});
export type SendInviteEmailInput = z.infer<typeof SendInviteEmailInputSchema>;

const SendInviteEmailOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type SendInviteEmailOutput = z.infer<typeof SendInviteEmailOutputSchema>;

export async function sendInviteEmail(input: SendInviteEmailInput): Promise<SendInviteEmailOutput> {
  return sendInviteFlow(input);
}

const invitePrompt = ai.definePrompt({
  name: 'inviteEmailPrompt',
  input: {schema: SendInviteEmailInputSchema},
  output: {schema: z.object({ subject: z.string(), body: z.string() })},
  prompt: `You are an assistant for a gaming community platform called MinKing Esport.
  Your task is to generate a friendly and exciting email invitation.

  The user wants to invite someone with the email '{{recipientEmail}}'.
  The invitation link is '{{inviteLink}}'.

  Generate a subject and a body for the email. The tone should be welcoming and hint at the fun of discovering new games and joining a community.
  `,
});

const sendInviteFlow = ai.defineFlow(
  {
    name: 'sendInviteFlow',
    inputSchema: SendInviteEmailInputSchema,
    outputSchema: SendInviteEmailOutputSchema,
  },
  async (input) => {
    const { output: emailContent } = await invitePrompt(input);
    if (!emailContent) {
      return { success: false, message: "AI failed to generate an email." };
    }
    
    // Check if the API key is set
    if (!process.env.RESEND_API_KEY) {
        console.error("Resend API key is not configured in .env file.");
        return { success: false, message: "Email service is not configured on the server." };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        await resend.emails.send({
            // IMPORTANT: Change this to an email address on your verified domain.
            from: 'MinKing Esport <onboarding@resend.dev>',
            to: [input.recipientEmail],
            subject: emailContent.subject,
            html: emailContent.body.replace(/\n/g, '<br>'), // Simple newline to <br> conversion for HTML email
        });
    } catch (error) {
        console.error("Failed to send email:", error);
        return { success: false, message: "Failed to send the email due to a server error." };
    }
    
    return { 
      success: true, 
      message: "Invitation sent successfully!",
    };
  }
);
