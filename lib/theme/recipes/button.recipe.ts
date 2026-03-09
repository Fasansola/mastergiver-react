import { defineRecipe } from '@chakra-ui/react';

export const buttonRecipe = defineRecipe({
  base: {
    fontWeight: 'medium',
    borderRadius: 'button',
    transition: 'all 0.2s',
  },
  variants: {
    variant: {
      solid: {
        bg: 'brand.primary',
        color: 'white',
        _hover: {
          bg: 'brand.primaryHover',
          transform: 'translateY(-1px)',
          boxShadow: 'md',
        },
        _active: {
          transform: 'translateY(0)',
        },
        _disabled: {
          opacity: 0.6,
          cursor: 'not-allowed',
          _hover: {
            bg: 'brand.primary',
            transform: 'none',
          },
        },
      },
      ghost: {
        bg: 'transparent',
        color: 'brand.primary',
        _hover: {
          bg: 'rgba(47, 43, 119, 0.1)',
        },
      },
      subtle: {
        bg: 'brand.accent',
        color: 'text.primary',
        _hover: {
          bg: '#d7d4f5',
        },
      },
      outline: {
        borderWidth: '1px',
        borderColor: 'brand.primary',
        color: 'brand.primary',
        _hover: {
          bg: 'rgba(47, 43, 119, 0.05)',
        },
      },
    },
    size: {
      sm: { px: '5', py: '2', fontSize: 'small' },
      md: { px: '8', py: '6', fontSize: 'body', lineHeight: 'moderate' },
      lg: { px: '6', py: '3', fontSize: 'subheading' },
    },
  },
  defaultVariants: {
    variant: 'solid',
    size: 'md',
  },
});
