/**
 * MailerLite integration helper.
 *
 * Adds a new subscriber to a specific MailerLite group when a user creates
 * an account. The group ID is passed by the caller so individual and business
 * signups can each target their own group and automation.
 *
 * Required env var:  MAILERLITE_API_KEY
 * Individual group:  MAILERLITE_INDIVIDUAL_GROUP_ID
 * Business group:    MAILERLITE_BUSINESS_GROUP_ID
 *
 * Failures are logged but never thrown — a MailerLite outage must never
 * block account creation.
 */

const MAILERLITE_API_URL = 'https://connect.mailerlite.com/api';

export async function addMailerLiteSubscriber({
  email,
  firstName,
  lastName,
  groupId,
}: {
  email: string;
  firstName: string;
  lastName: string;
  groupId?: string;
}): Promise<void> {
  const apiKey = process.env.MAILERLITE_API_KEY;

  if (!apiKey) {
    console.warn('MAILERLITE_API_KEY is not set — skipping subscriber sync.');
    return;
  }

  try {
    const body: Record<string, unknown> = {
      email,
      fields: {
        name: firstName,
        last_name: lastName,
      },
      // status active so automations trigger immediately
      status: 'active',
    };

    if (groupId) {
      body.groups = [groupId];
    }

    const res = await fetch(`${MAILERLITE_API_URL}/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`MailerLite subscriber sync failed (${res.status}):`, text);
    }
  } catch (err) {
    // Never let a MailerLite failure break signup
    console.error('MailerLite subscriber sync error:', err);
  }
}
