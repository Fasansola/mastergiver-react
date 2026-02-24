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

interface VerifyEmailProps {
  username: string;
  verificationUrl: string;
}

const verifyEmail = ({ username, verificationUrl }: VerifyEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address for MasterGiver</Preview>
      <Body style={styles.main}>
        <Container style={styles.container}>
          <Heading style={styles.h1}>
            Welcome to MasterGiver, {username}!
          </Heading>
          <Text style={styles.text}>
            Thank you for signing up. Please verify your email address to get
            started.
          </Text>
          <Link href={verificationUrl} style={styles.button}>
            Verify Email Address
          </Link>
          <Text style={styles.text}>
            Or copy and paster this URL into your browser:
          </Text>
          <Text style={styles.code}>{verificationUrl}</Text>
          <Text style={styles.footer}>
            This link will expire in 24 hours. If you didn&apos;t create an
            account, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default verifyEmail;
