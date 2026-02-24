import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components';

import { styles } from './styles';

interface ResetPasswordProps {
  username: string;
  resetUrl: string;
}

const ResetPassword = ({ username, resetUrl }: ResetPasswordProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your password for MasterGiver</Preview>
      <Body style={styles.main}>
        <Container style={styles.container}>
          <Heading style={styles.h1}>Password Reset Request</Heading>
          <Text style={styles.text}>Hi {username},</Text>
          <Text style={styles.text}>
            We received a request to reset your password. Click the button below
            to create a new password.
          </Text>
          <Link href={resetUrl} style={styles.button}>
            Reset Password
          </Link>
          <Text style={styles.text}>
            Or copy and paste this URL into your browser:
          </Text>
          <Text style={styles.code}>{resetUrl}</Text>
          <Text style={styles.footer}>
            This link will expire in 1 hour. If you didn&apos;t request a
            password reset, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ResetPassword;
