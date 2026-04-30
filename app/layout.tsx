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
  icons: {
    icon: '/brand-assets/MasterGiver favicon.png',
    apple: '/brand-assets/MasterGiver favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PRZTGF3B');`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body className={`${poppins.variable} ${libreBodoni.variable} font-body`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PRZTGF3B"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
