import AuthHeading from '@/components/auth/AuthHeading';
import SignUpForm from '@/components/auth/SignUpForm';
import { Flex, Text } from '@chakra-ui/react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sign Up | MasterGiver',
  description: 'Create your MasterGiver account',
};

const SignUpPage = () => {
  return (
    <Flex direction="column" width="100%" gap="40px">
      <AuthHeading title="Create an account">
        Already have an account?{' '}
        <Link href="/login">
          <Text as="span" color="text.link" fontWeight="500">
            Sign in
          </Text>
        </Link>
      </AuthHeading>
      <SignUpForm />
    </Flex>
  );
};

export default SignUpPage;
