import { pledgeInstance } from '@/lib/axios/pledge.axios';
import { AxiosError } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

interface PledgeOrgs {
  id: string;
  name: string;
  ngo_id: string;
  logo_url: string | null;
  website_url: string | null;
  mission: string | null;
  city: string | null;
  region: string | null;
}

interface PledgeResponse {
  results: PledgeOrgs[];
}

export interface OrgSearchResult {
  pledgeOrgId: string;
  name: string;
  ein: string | null;
  logo: string | null;
  website: string | null;
  mission: string | null;
  location: string | null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  // Reject Empty Queries
  if (!q || q.trim().length === 0) {
    return NextResponse.json(
      { error: 'Search query is required' },
      { status: 400 }
    );
  }

  try {
    const { data } = await pledgeInstance.get<PledgeResponse>(
      '/organizations',
      {
        params: { q: q.trim(), per: 10 },
      }
    );

    // Transform to our simplified shape

    const results: OrgSearchResult[] = data.results.map((org) => ({
      pledgeOrgId: org.id,
      name: org.name,
      ein: org.ngo_id ?? null,
      logo: org.logo_url ?? null,
      website: org.website_url ?? null,
      mission: org.mission ?? null,
      location: org.city && org.region ? `${org.city}, ${org.region}` : null,
    }));

    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    // Handle error
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        console.error('Pledge.to authentication failed');
        return NextResponse.json(
          {
            error: 'Organization search unavailable',
          },
          { status: 503 }
        );
      }

      if (error.code === 'ECONNABORTED') {
        return NextResponse.json(
          { error: 'Organization search timed out' },
          { status: 504 }
        );
      }
    }
    console.error('Organization search error: ', error);
    return NextResponse.json(
      { error: 'Failed to search organization' },
      { status: 500 }
    );
  }
}
