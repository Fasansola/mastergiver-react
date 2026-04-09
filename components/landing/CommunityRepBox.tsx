import { triElementBox } from '@/lib/types/landing';
import { Heading, Stack, Text } from '@chakra-ui/react';
import NextImage, { StaticImageData } from 'next/image';

type Props = Omit<triElementBox, 'image'> & { image: string | StaticImageData };

const CommunityRepBox = ({ image, title, description }: Props) => {
  return (
    <Stack
      p={{ base: '5', lg: '8' }}
      gap="4"
      bg="#fff"
      boxShadow="0px 1px 2px 0px #4646490F, 0px 5px 3px 0px #4646490A"
      border="0.5px solid #DCDFE3"
      borderRadius="16px"
      align="center"
      textAlign="center"
      minH={{ base: '100%', md: '380px' }}
      justify="center"
    >
      <Stack gap="10" align="center">
        <NextImage alt={title} src={image} />
        <Heading className="font-display" fontSize="28px" color="brand.primary">
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

export default CommunityRepBox;
