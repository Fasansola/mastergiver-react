import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Libre_Bodoni } from 'next/font/google';
import { Provider } from '@/components/ui/provider';
import './globals.css';

const poppins = Poppins({
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
});

const libreBodoni = Libre_Bodoni({
  variable: '--font-libre-bodoni',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'https://mastergiver.com'
  ),
  title: {
    default: 'MasterGiver — Verified Business Reputation Profiles',
    template: '%s | MasterGiver',
  },
  description:
    "MasterGiver turns your business's charitable giving and community involvement into verified reputation signals so AI recommends you, search engines rank you higher, and customers choose you.",
  openGraph: {
    type: 'website',
    siteName: 'MasterGiver',
    title: 'MasterGiver — Verified Business Reputation Profiles',
    description:
      'Turn your community impact into verified reputation signals that AI and search engines trust.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MasterGiver — Verified Business Reputation Profiles',
    description:
      'Turn your community impact into verified reputation signals that AI and search engines trust.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${libreBodoni.variable} font-body`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
