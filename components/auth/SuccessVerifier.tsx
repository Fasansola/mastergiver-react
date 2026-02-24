import { Flex, Heading, Button, Spinner, Text } from '@chakra-ui/react';
import Link from 'next/link';
import Image from 'next/image';
import { ReactNode } from 'react';
import SuccessIcon from '@/public/components-assets/Success Icon.svg';
import ErrorIcon from '@/public/components-assets/error-svgrepo-com.svg';

interface Props {
  title: string;
  status?: 'missing-token' | 'error' | 'verifying';
  children: ReactNode;
}

const SuccessVerifier = ({ title, status, children }: Props) => {
  return (
    <Flex direction="column" gap="40px" align="center" width="100%">
      <Flex direction="column" gap="32px" align="center" width="100%">
        {status === 'verifying' ? (
          <Spinner size="xl" color="brand.primary" />
        ) : (
          <Image
            alt="confirmation icon"
            src={status ? ErrorIcon : SuccessIcon}
            width={106}
            height={106}
          />
        )}

        <Flex direction="column" gap="16px" align="center" width="100%">
          <Heading fontSize="heading" color="text.heading" fontWeight="700">
            {title}
          </Heading>
          <Text
            color="text.primary"
            as={Flex}
            alignItems="center"
            className="flex-col"
            gap="4"
          >
            {children}
          </Text>
        </Flex>
      </Flex>
      <Button>
        <Link href="/login">Back to Login</Link>
      </Button>
    </Flex>
  );
};

export default SuccessVerifier;
