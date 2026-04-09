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
        style={{
          fontSize: '16px',
          lineHeight: '160%',
          color: '#212325',
          whiteSpace: 'pre-wrap',
          marginBottom: website ? '16px' : 0,
        }}
      >
        {aboutUs}
      </p>
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
