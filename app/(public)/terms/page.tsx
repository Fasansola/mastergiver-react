/**
 * Terms of Use page — /terms
 *
 * Static legal page outlining MasterGiver's terms of use.
 * Inherits header/footer from app/(public)/layout.tsx.
 * Styled with the business panel design tokens.
 */
import type { Metadata } from 'next';
import { Box, Container, Stack, Text } from '@chakra-ui/react';

export const metadata: Metadata = {
  title: 'Terms of Use | MasterGiver',
  description:
    'Read the MasterGiver Terms of Use to understand your rights and responsibilities when using our platform.',
};

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: 'By creating an account, accessing, or using MasterGiver, you accept and agree to abide by these Terms of Use. MasterGiver reserves the right to modify or update these Terms at any time, and any changes will be effective upon posting on our website. Your continued use of MasterGiver following changes means you accept the modified Terms.',
  },
  {
    title: '2. Services Provided by MasterGiver',
    body: 'MasterGiver is an online platform where users can create profiles to showcase their charitable and philanthropic efforts. Our goal is to provide a centralized space for users to share and promote their positive contributions to the community. MasterGiver does not directly engage in charitable activities and is not responsible for verifying the authenticity of any claims or information shared by users on their profiles.',
  },
  {
    title: '3. User Account and Profile Creation',
    body: 'To use certain features of MasterGiver, you must create an account and provide accurate information. You are responsible for maintaining the confidentiality of your account login details and are fully responsible for all activities that occur under your account. You agree to notify MasterGiver immediately of any unauthorized use of your account.',
  },
  {
    title: '4. User Conduct',
    intro: 'When using MasterGiver, you agree to:',
    bullets: [
      'Use the platform for lawful purposes only and not for any fraudulent or misleading activity.',
      'Respect the rights and privacy of other users.',
      'Not post or share any content that is false, defamatory, obscene, or otherwise offensive.',
      "Not engage in any activity that disrupts or interferes with the platform's functionality or security.",
    ],
  },
  {
    title: '5. Content and Intellectual Property',
    subsections: [
      {
        label: 'User Content:',
        body: 'By posting content on MasterGiver (e.g., descriptions of charitable activities, images, etc.), you grant MasterGiver a non-exclusive, royalty-free, worldwide license to use, display, reproduce, and distribute this content for platform-related purposes.',
      },
      {
        label: 'Prohibited Content:',
        body: 'Users are prohibited from posting content that infringes on intellectual property rights, violates the privacy of others, or is otherwise unlawful. MasterGiver reserves the right to remove any content that violates these Terms.',
      },
    ],
  },
  {
    title: '6. Disclaimer of Liability',
    subsections: [
      {
        label: 'Platform Use:',
        body: 'MasterGiver provides a platform for users to showcase their charitable efforts. We do not verify or endorse the authenticity, accuracy, or completeness of any user-submitted content. Users assume full responsibility for any actions taken based on information found on MasterGiver.',
      },
      {
        label: 'No Guarantees:',
        body: "MasterGiver makes no representations or warranties of any kind regarding the platform's suitability, reliability, availability, timeliness, or accuracy for any purpose. Your use of MasterGiver is at your own risk.",
      },
      {
        label: 'Third-Party Links and Content:',
        body: 'MasterGiver may contain links to third-party websites or content. We do not control, endorse, or assume any responsibility for the content or practices of these third parties.',
      },
    ],
  },
  {
    title: '7. Limitation of Liability',
    body: 'To the fullest extent permitted by law, MasterGiver and its affiliates, employees, and partners shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of or inability to use the platform, including but not limited to damages for loss of goodwill, data, or profits.',
  },
  {
    title: '8. Indemnification',
    body: 'You agree to indemnify, defend, and hold harmless MasterGiver, its affiliates, and its employees from any claims, liabilities, damages, or expenses arising from your use of the platform, your breach of these Terms, or your violation of any rights of another.',
  },
  {
    title: '9. Termination',
    body: 'MasterGiver reserves the right to suspend or terminate your access to the platform at any time, without prior notice, for any reason, including but not limited to a breach of these Terms. Upon termination, your right to use the platform will immediately cease.',
  },
  {
    title: '10. Governing Law',
    body: 'These Terms of Use are governed by the laws of the State of North Carolina. Any disputes arising from your use of MasterGiver or these Terms will be resolved in the courts located in the State of North Carolina.',
  },
  {
    title: '11. Contact Information',
    body: 'If you have any questions about these Terms of Use or need support, please contact us at support@mastergiver.com.',
  },
];

const TermsPage = () => {
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
              MasterGiver Terms of Use
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
              Welcome to MasterGiver. Please read these Terms of Use carefully
              before using our platform, as they govern your use of our services
              and outline your responsibilities as a user. By accessing or using
              MasterGiver, you agree to these Terms of Use.
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

              {/* Plain body */}
              {'body' in section && section.body && (
                <Text
                  fontFamily="'SF Pro Display', 'SF Pro Text', system-ui, sans-serif"
                  fontSize="16px"
                  lineHeight="150%"
                  color="#000000"
                >
                  {section.body}
                </Text>
              )}

              {/* Bulleted list */}
              {'bullets' in section && section.bullets && (
                <Stack gap="2">
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
                  <Box
                    as="ul"
                    pl="6"
                    fontFamily="'SF Pro Display', 'SF Pro Text', system-ui, sans-serif"
                    fontSize="16px"
                    lineHeight="150%"
                    color="#000000"
                  >
                    {section.bullets.map((item) => (
                      <Box as="li" key={item} mb="2">
                        {item}
                      </Box>
                    ))}
                  </Box>
                </Stack>
              )}

              {/* Labeled subsections */}
              {'subsections' in section && section.subsections && (
                <Stack gap="3">
                  {section.subsections.map((sub) => (
                    <Text
                      key={sub.label}
                      fontFamily="'SF Pro Display', 'SF Pro Text', system-ui, sans-serif"
                      fontSize="16px"
                      lineHeight="150%"
                      color="#000000"
                    >
                      <Box as="span" fontWeight="700" color="#27262D" mr="1">
                        {sub.label}
                      </Box>
                      {sub.body}
                    </Text>
                  ))}
                </Stack>
              )}
            </Stack>
          ))}

          {/* Acceptance footer */}
          <Box borderTop="1px solid #E9EAED" pt="8" mt="2">
            <Stack gap="3">
              <Text
                as="h2"
                fontFamily="'Libre Bodoni', Georgia, serif"
                fontWeight="700"
                fontSize={{ base: '18px', lg: '20px' }}
                lineHeight="150%"
                color="#2F2B77"
              >
                Acceptance of Terms
              </Text>
              <Text
                fontFamily="'SF Pro Display', 'SF Pro Text', system-ui, sans-serif"
                fontSize="16px"
                lineHeight="150%"
                color="#000000"
              >
                By creating an account or using MasterGiver, you acknowledge
                that you have read, understood, and agree to be bound by these
                Terms of Use. Thank you for being part of MasterGiver and
                helping us build a positive, impactful community.
              </Text>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default TermsPage;
