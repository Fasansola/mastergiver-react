import { HStack, Text } from '@chakra-ui/react';
import Image from 'next/image';
import BrandCheckIcon from '@/public/landing/BrandCheck.svg';
import { CheckProps } from '@/lib/types/landing';

const BrandCheck = ({ item }: CheckProps) => {
  return (
    <HStack align="start">
      <Image src={BrandCheckIcon} alt="Brand check" />
      <Text
        color="text.primary"
        className="font-body"
        fontSize="18px"
        lineHeight="160%"
      >
        {item}
      </Text>
    </HStack>
  );
};

export default BrandCheck;
