import { HStack, Text } from '@chakra-ui/react';
import Image from 'next/image';
import LightCheckIcon from '@/public/landing/Lightcheck.svg';
import { CheckProps } from '@/lib/types/landing';

const LightCheck = ({ item }: CheckProps) => {
  return (
    <HStack align="start" gap="4">
      <Image src={LightCheckIcon} alt="Light check" />
      <Text
        color="white"
        className="font-body"
        fontSize={{ base: '18px', lg: '21px' }}
        lineHeight="160%"
      >
        {item}
      </Text>
    </HStack>
  );
};

export default LightCheck;
