import { triElementBox } from '@/lib/types/landing';
import { Heading, Stack, Text } from '@chakra-ui/react';
import NextImage, { StaticImageData } from 'next/image';

type Props = Omit<triElementBox, 'image'> & { image: string | StaticImageData };

const WhatYouGetBox = ({ image, title, description }: Props) => {
  return (
    <Stack
      p={{ base: '5', lg: '8' }}
      gap="4"
      bg="white"
      boxShadow="0px 1px 2px 0px #4646490F, 0px 5px 3px 0px #4646490A"
      borderRadius="12px"
      align="center"
      textAlign="center"
    >
      <Stack gap="10" align="center">
        <NextImage alt={title} src={image} width="100" height="100" />
        <Heading className="font-display" fontSize={{ base: '20px', lg: '28px' }} color="brand.primary">
          {title}
        </Heading>
      </Stack>

      <Text
        color="text.primary"
        className="font-body"
        lineHeight="180%"
        fontSize="body"
        maxW="360px"
      >
        {description}
      </Text>
    </Stack>
  );
};

export default WhatYouGetBox;
