import { HStack, Text } from '@chakra-ui/react';
import Image from 'next/image';
import GreenCheckIcon from '@/public/landing/GreenCheck.svg';
import { CheckProps } from '@/lib/types/landing';

const GreenCheck = ({ item }: CheckProps) => {
  return (
    <HStack>
      <Image src={GreenCheckIcon} alt="Green check" />
      <Text fontWeight="500" color="text.primary" className="font-body">
        {item}
      </Text>
    </HStack>
  );
};

export default GreenCheck;
