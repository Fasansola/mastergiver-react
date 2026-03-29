'use client';

import { Stack, Heading, Text, HStack } from '@chakra-ui/react';
import Image from 'next/image';
import { useState } from 'react';
import Arrow from '@/public/components-assets/chevron-right.svg';

interface ReadMoreProps {
  label: string;
  value: string;
}

const ReadMore = ({ label, value }: ReadMoreProps) => {
  const [toggle, setToggle] = useState(false);
  return (
    <Stack minW="100%" gap="4">
      <Heading>{label}</Heading>
      <Stack minW="100%" gap="6">
        {value.length < 140 ? (
          <Text>{value}</Text>
        ) : (
          <>
            <Text>{toggle ? value : value?.slice(0, 140) + '...'}</Text>
            <HStack onClick={() => setToggle(!toggle)} minW="100%">
              <Text
                color="brand.primary"
                _hover={{ color: 'text.link' }}
                fontWeight="500"
                cursor="pointer"
              >
                {toggle ? 'READ LESS' : 'READ MORE'}
              </Text>
              <Image src={Arrow} alt="arrow icon" />
            </HStack>
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default ReadMore;
