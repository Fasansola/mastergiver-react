import { triElementBox } from '@/lib/types/landing';
import { Heading, Stack, Text } from '@chakra-ui/react';

const PricingValueBox = ({ price, title, description }: triElementBox) => {
  return (
    <Stack
      p={{ base: '6', lg: '10' }}
      gap="6"
      bg="#EEEDFF"
      boxShadow="0px 1px 2px 0px #4646490F, 0px 5px 3px 0px #4646490A"
      borderRadius="12px"
      align="center"
      textAlign="center"
    >
      <Stack gap="5" align="center">
        <Heading
          className="font-display"
          fontSize={{ base: '22px', lg: '28px' }}
          color="brand.primary"
          fontWeight="500"
        >
          {price}
        </Heading>

        <Text
          className="font-body"
          fontSize="heading"
          color="text.primary"
          fontWeight="700"
          textTransform="uppercase"
        >
          {title}
        </Text>
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

export default PricingValueBox;
