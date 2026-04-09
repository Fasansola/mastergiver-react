import { triElementBox } from '@/lib/types/landing';
import { Heading, Stack, Text } from '@chakra-ui/react';
import NextImage, { StaticImageData } from 'next/image';

type Props = Omit<triElementBox, 'image'> & { image: string | StaticImageData };

const CommunityImpactBox = ({ image, title, description }: Props) => {
  return (
    <Stack
      p={{ base: '6', lg: '10' }}
      gap="6"
      bg="#EEEDFF"
      boxShadow="0px 1px 2px 0px #4646490F, 0px 5px 3px 0px #4646490A"
      borderRadius="12px"
      align="center"
      textAlign="center"
      w="100%"
    >
      <Stack gap="10" align="center">
        <Stack
          bgColor="white"
          borderRadius="8px"
          maxW="100px"
          maxH="100px"
          w="100px"
          h="100px"
          alignItems="center"
          justifyContent="center"
          flexShrink="0"
          border="0.5px solid #AECCFF"
        >
          <NextImage alt={title} src={image} width="60" height="60" />
        </Stack>
        <Heading className="font-display" fontSize="28px" color="brand.primary">
          {title}
        </Heading>
      </Stack>

      <Text
        color="text.primary"
        className="font-body"
        lineHeight="180%"
        fontSize="body"
        maxW="320px"
      >
        {description}
      </Text>
    </Stack>
  );
};

export default CommunityImpactBox;
