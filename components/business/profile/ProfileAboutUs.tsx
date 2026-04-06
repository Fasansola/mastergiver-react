/**
 * ProfileAboutUs — public business profile.
 *
 * Renders the About Us text block. Only shown when aboutUs is non-empty.
 * Named ProfileAboutUs to avoid a file-name collision with the edit-profile
 * component of the same purpose (AboutUsSection.tsx).
 *
 * Line breaks are preserved by escaping the text for XSS safety, then
 * replacing \n with <br /> and injecting via dangerouslySetInnerHTML.
 * This is the most reliable approach — CSS white-space and JSX span/br
 * splits can both be overridden by ancestor styles.
 */

interface ProfileAboutUsProps {
  aboutUs: string;
  website: string | null;
}

/** Escape HTML special characters then convert newlines to <br /> tags. */
function toBrHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\r\n/g, '\n')
    .replace(/\n/g, '<br />');
}

const ProfileAboutUs = ({ aboutUs, website }: ProfileAboutUsProps) => {
  return (
    <section>
      <h2
        className="font-display"
        style={{
          fontWeight: 700,
          fontSize: '24px',
          lineHeight: '140%',
          color: '#27262D',
          marginBottom: '12px',
        }}
      >
        About Us
      </h2>
      <p
        dangerouslySetInnerHTML={{ __html: toBrHtml(aboutUs) }}
        style={{ fontSize: '16px', lineHeight: '160%', color: '#212325', marginBottom: website ? '16px' : 0 }}
      />
      {website && (
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: '15px', color: '#2F2B77', fontWeight: 600, textDecoration: 'none' }}
        >
          {website.replace(/^https?:\/\//, '')} ↗
        </a>
      )}
    </section>
  );
};

export default ProfileAboutUs;
