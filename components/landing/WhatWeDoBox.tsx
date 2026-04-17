import { triElementBox } from '@/lib/types/landing';
import { Heading, Stack, Text } from '@chakra-ui/react';
import NextImage, { StaticImageData } from 'next/image';

type Props = Omit<triElementBox, 'image'> & { image: string | StaticImageData };

const WhatWeDoBox = ({ image, title, description }: Props) => {
  return (
    <Stack
      p={{ base: '5', lg: '10' }}
      gap="6"
      bg="#EEEDFF"
      boxShadow="0px 1px 2px 0px #4646490F, 0px 5px 3px 0px #4646490A"
      borderRadius="12px"
      align={{ base: 'center', md: 'start' }}
      textAlign={{ base: 'center', md: 'start' }}
      direction={{ base: 'column', md: 'row' }}
    >
      <Stack
        bgColor="brand.primary"
        borderRadius="8px"
        maxW="76px"
        maxH="76px"
        w="76px"
        h="76px"
        alignItems="center"
        justifyContent="center"
        flexShrink="0"
      >
        <NextImage alt={title} src={image} width="40" height="40" />
      </Stack>
      <Stack gap="2">
        <Heading
          className="font-display"
          fontSize={{ base: '20px', lg: '28px' }}
          color="brand.primary"
        >
          {title}
        </Heading>
        <Text
          color="text.primary"
          className="font-body"
          lineHeight="160%"
          fontSize="18px"
        >
          {description}
        </Text>
      </Stack>
    </Stack>
  );
};

export default WhatWeDoBox;
