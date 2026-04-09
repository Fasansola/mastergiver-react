/**
 * Per-business Open Graph image — generated dynamically for each
 * /business/[slug] page.
 *
 * Shows the business name, tagline, and a "MasterGiver Verified" badge.
 * Output: 1200×630 PNG served at /business/[slug]/opengraph-image.
 */

import { ImageResponse } from 'next/og';
import { prisma } from '@/lib/prisma';

export const alt = 'Business profile on MasterGiver';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function OgImage({ params }: Props) {
  const { slug } = await params;

  const business = await prisma.business.findUnique({
    where: { slug },
    select: { companyName: true, tagline: true, address: true },
  });

  const name = business?.companyName ?? 'Business Profile';
  const tagline =
    business?.tagline ??
    business?.address ??
    'Verified community impact on MasterGiver';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#FFFCF7',
          padding: '72px 80px',
        }}
      >
        {/* MasterGiver badge top-left */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              background: '#2F2B77',
              borderRadius: '8px',
              padding: '6px 16px',
              color: '#FFFFFF',
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '1px',
            }}
          >
            MasterGiver
          </div>
          <span
            style={{
              color: '#575C62',
              fontSize: '18px',
              fontWeight: 500,
            }}
          >
            Verified Community Impact
          </span>
        </div>

        {/* Business name + tagline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              color: '#2F2B77',
              fontSize: name.length > 24 ? '56px' : '72px',
              fontWeight: 700,
              lineHeight: 1.1,
              maxWidth: '900px',
            }}
          >
            {name}
          </div>
          <div
            style={{
              color: '#575C62',
              fontSize: '28px',
              fontWeight: 400,
              lineHeight: 1.4,
              maxWidth: '800px',
            }}
          >
            {tagline}
          </div>
        </div>

        {/* Bottom URL */}
        <div
          style={{
            color: '#9CA3AF',
            fontSize: '20px',
          }}
        >
          mastergiver.com/business/{slug}
        </div>
      </div>
    ),
    { ...size }
  );
}
