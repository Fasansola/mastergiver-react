import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import { buttonRecipe } from './recipes/button.recipe';
import { inputRecipe } from './recipes/input.recipe';

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          primary: { value: '#2F2B77' }, // Your primary color
          primaryHover: { value: '#1F1B57' }, // Darker shade for hover
          primaryLight: { value: '#4A45A0' }, // Lighter shade
        },
        background: {
          page: { value: '#f7f8fa' }, // Page background
          card: { value: '#FFFFFF' }, // White cards/boxes
          white: { value: '#FFFFFF' }, // White cards/boxes
          input: { value: '#FFFFFF' }, // Input backgrounds
        },
        text: {
          heading: { value: '#27262D' },
          primary: { value: '#212325' }, // Main text
          secondary: { value: '#575C62' }, // Muted text
          link: { value: '#5851BF' }, // Link text
          error: { value: '#E53E3E' }, // Error messages
        },
        border: {
          accentBorder: { value: '#E9EAED' }, // Use border on elements
          default: { value: '#DCDFE3' }, // Input borders
          focus: { value: '#2F2B77' }, // Focus state
          error: { value: '#FC8181' }, // Error state
        },
      },
      fontSizes: {
        heading: { value: '24px' },
        subheading: { value: '18px' },
        body: { value: '16px' },
        small: { value: '14px' },
      },
      fonts: {
        heading: { value: 'var(--font-poppins), Helvetica, sans-serif' },
        body: { value: 'var(--font-poppins), Helvetica, sans-serif' },
      },
      radii: {
        card: { value: '8px' }, // Your 2xl rounded cards
        input: { value: '4px' }, // Input border radius
        button: { value: '4px' }, // Button border radius
      },
      spacing: {
        formGap: { value: '24px' }, // Gap between form fields
        sectionGap: { value: '48px' }, // Gap between sections
      },
      shadows: { formBox: { value: '0px 5px 3px 0px #4646490A' } },
    },

    recipes: {
      button: buttonRecipe,
      input: inputRecipe,
    },
  },
});

export const system = createSystem(defaultConfig, config);
