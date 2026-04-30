/**
 * Privacy Policy page — /privacy
 *
 * Static legal page outlining MasterGiver's privacy practices.
 * Inherits header/footer from app/(public)/layout.tsx.
 * Styled with the business panel design tokens.
 */
import type { Metadata } from 'next';
import { Box, Container, Stack, Text } from '@chakra-ui/react';

export const metadata: Metadata = {
  title: 'Privacy Policy | MasterGiver',
  description:
    'Learn how MasterGiver collects, uses, and protects your personal information.',
  alternates: { canonical: 'https://mastergiver.com/privacy' },
  openGraph: {
    title: 'Privacy Policy | MasterGiver',
    description: 'Learn how MasterGiver collects, uses, and protects your personal information.',
    url: 'https://mastergiver.com/privacy',
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy | MasterGiver',
    description: 'Learn how MasterGiver collects, uses, and protects your personal information.',
  },
};

type SubItem = { label: string; body: string };

type Section = {
  title: string;
  body?: string;
  intro?: string;
  bullets?: (string | SubItem)[];
  subsections?: { title: string; items: SubItem[] }[];
};

const SECTIONS: Section[] = [
  {
    title: '1. Information We Collect',
    intro:
      'We collect various types of information to provide and improve our services, including:',
    subsections: [
      {
        title: 'a. Personal Information',
        items: [
          {
            label: 'Account Information:',
            body: 'When you create a MasterGiver account, we collect personal information such as your name, email address, and any other details you choose to add to your profile.',
          },
          {
            label: 'Profile Information:',
            body: 'You may choose to provide additional information on your profile, such as your bio, photos, and details about your charitable activities.',
          },
        ],
      },
      {
        title: 'b. Usage Information',
        items: [
          {
            label: 'Device and Log Data:',
            body: 'We automatically collect information about your device, browser type, IP address, pages viewed, and other usage details when you access our platform.',
          },
          {
            label: 'Cookies and Similar Technologies:',
            body: 'We use cookies and similar technologies to enhance your experience, analyze traffic, and understand user behavior on our site. For more information, please refer to our Cookies Policy below.',
          },
        ],
      },
    ],
  },
  {
    title: '2. How We Use Your Information',
    intro: 'We use the information we collect for various purposes, including to:',
    bullets: [
      'Provide, operate, and improve our platform',
      'Personalize user experience and deliver relevant content',
      'Communicate with you about your account, updates, and customer support',
      'Understand user engagement and conduct analytics to improve our services',
      'Enforce our Terms of Use and protect our platform against fraud and abuse',
    ],
  },
  {
    title: '3. Sharing and Disclosure of Information',
    intro:
      'We respect your privacy and will not sell your personal information to third parties. We may share your information only in the following circumstances:',
    bullets: [
      {
        label: 'Service Providers:',
        body: 'We may share your information with trusted third-party service providers who assist us in operating our platform, conducting business, or serving users, provided they comply with confidentiality agreements.',
      },
      {
        label: 'Legal Requirements:',
        body: 'We may disclose your information if required by law or in response to valid legal processes such as subpoenas, court orders, or government requests.',
      },
      {
        label: 'Business Transfers:',
        body: 'In the event of a merger, acquisition, or sale of all or a portion of our assets, we may transfer your information as part of the transaction.',
      },
    ],
  },
  {
    title: '4. Cookies Policy',
    intro:
      'We use cookies to enhance your browsing experience. Cookies are small data files that are placed on your device and help us understand how you interact with our site.',
    subsections: [
      {
        title: 'Types of Cookies We Use:',
        items: [
          {
            label: 'Essential Cookies:',
            body: 'These cookies are necessary for the website to function.',
          },
          {
            label: 'Analytics Cookies:',
            body: 'We use analytics cookies to collect data on user interactions and improve our platform.',
          },
          {
            label: 'Preference Cookies:',
            body: 'These cookies remember your settings and preferences for a personalized experience.',
          },
        ],
      },
    ],
    body: 'You may choose to disable cookies in your browser settings; however, doing so may limit some functionalities of our platform.',
  },
  {
    title: '5. Security of Your Information',
    body: 'We implement reasonable technical and organizational security measures to protect your personal information. However, please be aware that no method of transmission over the internet or electronic storage is completely secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.',
  },
  {
    title: '6. Your Rights and Choices',
    intro: 'You have certain rights regarding your personal information, which include:',
    bullets: [
      {
        label: 'Access and Correction:',
        body: 'You may access and update your personal information directly through your MasterGiver account settings.',
      },
      {
        label: 'Data Portability:',
        body: 'Upon request, you can obtain a copy of the personal information we hold about you in a structured, machine-readable format.',
      },
      {
        label: 'Deletion:',
        body: 'You may request that we delete your account and any personal information we hold, subject to certain legal obligations.',
      },
      {
        label: 'Objection and Restriction:',
        body: 'You have the right to object to the processing of your personal information in certain circumstances.',
      },
    ],
    body: 'To exercise any of these rights, please contact us at support@mastergiver.com.',
  },
  {
    title: '7. Third-Party Links',
    body: "Our platform may contain links to third-party websites or services that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We encourage you to review the Privacy Policy of every site you visit, as we are not responsible for the privacy practices of these external sites.",
  },
  {
    title: "8. Children's Privacy",
    body: 'MasterGiver is intended for users who are 13 years and older. We do not knowingly collect or solicit personal information from children under the age of 13. If we become aware that we have collected personal information from a child under 13 without verified parental consent, we will take steps to remove that information from our systems.',
  },
  {
    title: '9. Changes to This Privacy Policy',
    body: 'We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or other factors. Any changes will be posted on this page, and the "Last updated" date will reflect the most recent revision. Your continued use of MasterGiver after any updates constitutes your acceptance of the revised Privacy Policy.',
  },
  {
    title: '10. Contact Us',
    intro:
      'If you have questions about this Privacy Policy or how we handle your information, please contact us at:',
    bullets: ['Email: support@mastergiver.com'],
  },
];

/** Renders a single bullet that may be plain text or a labeled sub-item */
const BulletItem = ({ item }: { item: string | SubItem }) => {
  if (typeof item === 'string') {
    return (
      <Box as="li" mb="2">
        {item}
      </Box>
    );
  }
  return (
    <Box as="li" mb="2">
      <Box as="span" fontWeight="700" color="#27262D" mr="1">
        {item.label}
      </Box>
      {item.body}
    </Box>
  );
};

const PrivacyPage = () => {
  return (
    <Box bgColor="white">
      {/* Page header */}
      <Box
        bgGradient="linear(107.69deg, #F3F6FF 0%, #F1F5FF 100%)"
        borderBottom="1px solid #E9EAED"
        py={{ base: '60px', lg: '80px' }}
      >
        <Container maxW="800px">
          <Stack gap="3">
            <Text
              as="h1"
              fontFamily="'Libre Bodoni', Georgia, serif"
              fontWeight="700"
              fontSize={{ base: '28px', lg: '32px' }}
              lineHeight="120%"
              color="#27262D"
            >
              Privacy Policy
            </Text>
            <Text
              fontFamily="'SF Pro Display', 'SF Pro Text', system-ui, sans-serif"
              fontSize="14px"
              color="#575C62"
            >
              Last updated: April 10, 2026
            </Text>
            <Text
              fontFamily="'SF Pro Display', 'SF Pro Text', system-ui, sans-serif"
              fontSize="16px"
              lineHeight="150%"
              color="#000000"
              pt="2"
            >
              MasterGiver ("we," "us," or "our") values your privacy and is
              committed to protecting the personal information you provide to us.
              This Privacy Policy describes how we collect, use, disclose, and
              safeguard your information when you visit our website and use our
              platform.
            </Text>
            <Text
              fontFamily="'SF Pro Display', 'SF Pro Text', system-ui, sans-serif"
              fontSize="16px"
              lineHeight="150%"
              color="#000000"
            >
              By accessing or using MasterGiver, you agree to the collection and
              use of information in accordance with this Privacy Policy.
            </Text>
          </Stack>
        </Container>
      </Box>

      {/* Sections */}
      <Container maxW="800px" py={{ base: '60px', lg: '80px' }}>
        <Stack gap="10">
          {SECTIONS.map((section) => (
            <Stack key={section.title} gap="3">
              <Text
                as="h2"
                fontFamily="'Libre Bodoni', Georgia, serif"
                fontWeight="700"
                fontSize={{ base: '18px', lg: '20px' }}
                lineHeight="150%"
                color="#2F2B77"
              >
                {section.title}
              </Text>

              {/* Optional intro sentence */}
              {section.intro && (
                <Text
                  fontFamily="'SF Pro Display', 'SF Pro Text', system-ui, sans-serif"
                  fontSize="16px"
                  lineHeight="150%"
                  color="#000000"
                >
                  {section.intro}
                </Text>
              )}

              {/* Nested subsections (e.g. a. / b. groups with labeled items) */}
              {section.subsections && (
                <Stack gap="5">
                  {section.subsections.map((sub) => (
                    <Stack key={sub.title} gap="2">
                      <Text
                        fontFamily="'SF Pro Display', 'SF Pro Text', system-ui, sans-serif"
                        fontWeight="700"
                        fontSize="16px"
                        lineHeight="150%"
                        color="#27262D"
                      >
                        {sub.title}
                      </Text>
                      <Stack gap="2" pl="1">
                        {sub.items.map((item) => (
                          <Text
                            key={item.label}
                            fontFamily="'SF Pro Display', 'SF Pro Text', system-ui, sans-serif"
                            fontSize="16px"
                            lineHeight="150%"
                            color="#000000"
                          >
                            <Box as="span" fontWeight="700" color="#27262D" mr="1">
                              {item.label}
                            </Box>
                            {item.body}
                          </Text>
                        ))}
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              )}

              {/* Bullet list (plain strings or labeled sub-items) */}
              {section.bullets && (
                <Box
                  as="ul"
                  pl="6"
                  fontFamily="'SF Pro Display', 'SF Pro Text', system-ui, sans-serif"
                  fontSize="16px"
                  lineHeight="150%"
                  color="#000000"
                >
                  {section.bullets.map((item, i) => (
                    <BulletItem key={i} item={item} />
                  ))}
                </Box>
              )}

              {/* Plain body (may follow subsections or bullets) */}
              {section.body && (
                <Text
                  fontFamily="'SF Pro Display', 'SF Pro Text', system-ui, sans-serif"
                  fontSize="16px"
                  lineHeight="150%"
                  color="#000000"
                >
                  {section.body}
                </Text>
              )}
            </Stack>
          ))}

          {/* Closing consent statement */}
          <Box borderTop="1px solid #E9EAED" pt="8" mt="2">
            <Text
              fontFamily="'SF Pro Display', 'SF Pro Text', system-ui, sans-serif"
              fontSize="16px"
              lineHeight="150%"
              color="#000000"
            >
              By using MasterGiver, you acknowledge that you have read and
              understood this Privacy Policy and consent to the collection, use,
              and disclosure of your information as described.
            </Text>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default PrivacyPage;
