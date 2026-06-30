import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Libre_Bodoni } from 'next/font/google';
import Script from 'next/script';
import { Provider } from '@/components/ui/provider';
import RecaptchaProvider from '@/components/RecaptchaProvider';
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
    default: 'MasterGiver — Verified Business Community Impact Profiles',
    template: '%s | MasterGiver',
  },
  description:
    "MasterGiver turns your business's charitable giving and community involvement into verified reputation signals so AI recommends you, search engines rank you higher, and customers choose you.",
  openGraph: {
    type: 'website',
    siteName: 'MasterGiver',
    title: 'MasterGiver — Verified Business Community Impact Profiles',
    description:
      'Turn your community impact into verified reputation signals that AI and search engines trust.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MasterGiver — Verified Business Community Impact Profiles',
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
      <body className={`${poppins.variable} ${libreBodoni.variable} font-body`}>
        {/* GTM noscript fallback — must stay at top of <body> */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PRZTGF3B"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <Provider>
          <RecaptchaProvider>{children}</RecaptchaProvider>
        </Provider>

        {/*
         * GTM moved from a render-blocking inline <script> in <head> to
         * next/script with strategy="afterInteractive". This defers the
         * GTM loader until after hydration — no longer blocks the parser
         * or delays LCP/FCP.
         */}
        <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PRZTGF3B');`,
          }}
        />
      </body>
    </html>
  );
}
