import { Resend } from 'resend';
import { render } from '@react-email/render';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Helper function to send emails

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: React.ReactElement;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from:
        process.env.NODE_ENV === 'production'
          ? 'MasterGiver <noreply@mastergiver.com>' // Production domain
          : 'MasterGiver <onboarding@resend.dev>', // Test domain,
      to,
      subject,
      html: await render(react),
    });

    if (error) {
      console.error('Email send error: ', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email send exception: ', error);
    return { success: false, error };
  }
}
