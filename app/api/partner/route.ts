/**
 * POST /api/partner
 *
 * Receives a partner inquiry form submission and sends a notification email
 * to the MasterGiver team. Returns 200 on success, 400 on validation failure,
 * 500 on send error.
 *
 * Calls the Resend SDK directly (not through the shared sendEmail helper) to
 * avoid Next.js's patched fetch intercepting the request.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const schema = z.object({
  contactName: z.string().min(1),
  organizationName: z.string().min(1),
  email: z.string().email(),
  website: z.string().optional(),
});

const NOTIFY_RECIPIENTS = ['carlos@mastergiver.com', 'justwpstudio@gmail.com'];

const resend = new Resend(process.env.RESEND_API_KEY);

function buildHtml(data: {
  contactName: string;
  organizationName: string;
  email: string;
  website?: string;
}) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 24px;background:#fff;">
      <h2 style="color:#2F2B77;margin-bottom:24px;">New Partner Inquiry</h2>
      <p style="color:#444;margin-bottom:24px;">
        A new organization has submitted the partner form on MasterGiver.
      </p>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #eee;font-weight:700;color:#575C62;width:40%;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Contact Name</td>
          <td style="padding:12px 0;border-bottom:1px solid #eee;color:#000000;">${data.contactName}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #eee;font-weight:700;color:#575C62;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Organization</td>
          <td style="padding:12px 0;border-bottom:1px solid #eee;color:#000000;">${data.organizationName}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #eee;font-weight:700;color:#575C62;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Email</td>
          <td style="padding:12px 0;border-bottom:1px solid #eee;color:#000000;">${data.email}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;font-weight:700;color:#575C62;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Website / Network</td>
          <td style="padding:12px 0;color:#000000;">${data.website || '—'}</td>
        </tr>
      </table>
      <p style="color:#9CA3AF;font-size:12px;margin-top:32px;">
        Sent automatically from the MasterGiver partner sign-up form.
      </p>
    </div>
  `;
}

export async function POST(req: NextRequest) {
  const body: unknown = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 });
  }

  const { contactName, organizationName, email, website } = parsed.data;

  const from =
    process.env.NODE_ENV === 'production'
      ? 'MasterGiver <noreply@mastergiver.com>'
      : 'MasterGiver <onboarding@resend.dev>';

  const html = buildHtml({ contactName, organizationName, email, website });
  const subject = `New Partner Inquiry — ${organizationName}`;

  const results = await Promise.all(
    NOTIFY_RECIPIENTS.map((to) =>
      resend.emails.send({ from, to, subject, html })
    )
  );

  const anyFailed = results.some((r) => r.error !== null);
  if (anyFailed) {
    console.error(
      'Partner email send errors:',
      results.map((r) => r.error)
    );
    return NextResponse.json(
      { error: 'Failed to send notification. Please try again.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
