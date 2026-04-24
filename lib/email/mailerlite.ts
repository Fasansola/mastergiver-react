/**
 * MailerLite integration helper.
 *
 * Adds a new subscriber to MailerLite when a user creates an account.
 * If MAILERLITE_GROUP_ID is set, the subscriber is added to that group
 * so any automation tied to the group fires automatically.
 *
 * Failures are logged but never thrown — a MailerLite outage must never
 * block account creation.
 */

const MAILERLITE_API_URL = 'https://connect.mailerlite.com/api';

export async function addMailerLiteSubscriber({
  email,
  firstName,
  lastName,
}: {
  email: string;
  firstName: string;
  lastName: string;
}): Promise<void> {
  const apiKey = process.env.MAILERLITE_API_KEY;

  if (!apiKey) {
    console.warn('MAILERLITE_API_KEY is not set — skipping subscriber sync.');
    return;
  }

  try {
    const groupId = process.env.MAILERLITE_GROUP_ID;

    const body: Record<string, unknown> = {
      email,
      fields: {
        name: firstName,
        last_name: lastName,
      },
      // status active so automations trigger immediately
      status: 'active',
    };

    // If a group ID is configured, include it so the welcome automation fires
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
