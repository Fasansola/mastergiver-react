import AuthHeading from '@/components/auth/AuthHeading';
import SignUpForm from '@/components/auth/SignUpForm';
import { auth } from '@/lib/auth/auth';
import { Flex, Text } from '@chakra-ui/react';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Sign Up | MasterGiver',
  description: 'Create your MasterGiver account',
};

const SignUpPage = async () => {
  const session = await auth();

  if (session?.user) {
    redirect('/dashboard');
  }
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
