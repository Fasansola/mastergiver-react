import { Heading } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface Props {
  color?: string;
  children: ReactNode;
}

const LandingH = ({ color, children }: Props) => {
  return (
    <Heading
      className="font-display"
      fontWeight="700"
      fontSize={{ base: '32px', md: '44px', lg: '56px' }}
      lineHeight="120%"
      color={color ? color : 'brand.primary'}
    >
      {children}
    </Heading>
  );
};

export default LandingH;
