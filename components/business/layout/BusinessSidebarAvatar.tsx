/**
 * Business sidebar avatar.
 *
 * Shows the business logo image if one has been uploaded.
 * Falls back to a purple circle displaying the first two initials of the
 * company name when no logo is available — or a generic "MG" if the name
 * is also missing.
 *
 * This is a pure display component — no state, no side effects.
 */

interface BusinessSidebarAvatarProps {
  logo: string | null;
  companyName: string | null;
}

/** Extract up to two initials from a company name. e.g. "Acme Corp" → "AC" */
function getInitials(name: string | null): string {
  if (!name) return 'MG';
  const words = name.trim().split(/\s+/);
  const letters = words.slice(0, 2).map((w) => w[0].toUpperCase());
  return letters.join('');
}

const BusinessSidebarAvatar = ({ logo, companyName }: BusinessSidebarAvatarProps) => {
  if (logo) {
    return (
      <img
        src={logo}
        alt={companyName ?? 'Business logo'}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '12px',
          objectFit: 'cover',
          display: 'block',
        }}
      />
    );
  }

  // Fallback — initials avatar
  return (
    <div
      aria-label={companyName ?? 'Business'}
      style={{
        width: '56px',
        height: '56px',
        borderRadius: '12px',
        background: '#2F2B77',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        fontWeight: 700,
        fontSize: '18px',
        letterSpacing: '0.5px',
        flexShrink: 0,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
      }}
    >
      {getInitials(companyName)}
    </div>
  );
};

export default BusinessSidebarAvatar;
