import { HStack, Text } from '@chakra-ui/react';
import Image from 'next/image';
import GreenCheckIcon from '@/public/landing/GreenCheck.svg';
import { CheckProps } from '@/lib/types/landing';

const GreenCheck = ({ item }: CheckProps) => {
  return (
    <HStack align="start">
      <Image src={GreenCheckIcon} alt="Green check" />
      <Text color="text.primary" className="font-body" lineHeight="140%">
        {item}
      </Text>
    </HStack>
  );
};

export default GreenCheck;
