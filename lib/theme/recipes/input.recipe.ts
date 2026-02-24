import { defineRecipe } from '@chakra-ui/react';

export const inputRecipe = defineRecipe({
  base: {
    borderRadius: 'input',
    borderWidth: '9px',
    bg: 'background.input',
    px: '4',
    py: '6',
    fontSize: 'body',
    transition: 'all 0.2s',
    color: 'text.primary',
    _placeholder: {
      color: 'text.secondary',
    },
    _focus: {
      borderColor: 'border.focus',
      boxShadow: '0 0 0 1px var(--chakra-colors-border-focus)',
      outline: 'none',
    },
    _invalid: {
      borderColor: 'border.error',
      _focus: {
        borderColor: 'border.error',
        boxShadow: '0 0 0 1px var(--chakra-colors-border-error)',
      },
    },
    _disabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
      bg: 'gray.100',
    },
  },
});
