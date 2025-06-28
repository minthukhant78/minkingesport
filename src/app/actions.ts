'use server';

import { sendInviteEmail } from "@/ai/flows/send-invite-email";

export async function sendInviteAction(formData: FormData) {
    const email = formData.get('email') as string;
    const inviteLink = formData.get('inviteLink') as string;

    if (!email || !inviteLink) {
        return { success: false, message: 'Email and invite link are required.' };
    }

    try {
        const result = await sendInviteEmail({
            recipientEmail: email,
            inviteLink: inviteLink
        });
        return result;
    } catch (error) {
        console.error("Error sending invite:", error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}
