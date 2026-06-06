import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import { buttonRecipe } from './recipes/button.recipe';
import { inputRecipe } from './recipes/input.recipe';

const config = defineConfig({
  theme: {
    breakpoints: {
      '3xl': '1920px',
    },
    tokens: {
      colors: {
        brand: {
          primary: { value: '#2F2B77' }, // Your primary color
          accent: { value: '#ECEBF8' }, // Accent for light btns
          primaryHover: { value: '#1F1B57' }, // Darker shade for hover
          primaryLight: { value: '#4A45A0' }, // Lighter shade
        },
        directory: {
          cardBorder: { value: '#EBEBF5' },
          cardBorderHover: { value: '#D4D0F5' },
          heading: { value: '#1A1730' },
          muted: { value: '#9CA3AF' },
          body: { value: '#6B7280' },
          chipBg: { value: '#F4F2FF' },
          chipBorder: { value: '#E2DFFF' },
          chipText: { value: '#5B52C0' },
          separator: { value: '#F0EEF8' },
          logoBorder: { value: '#F0EEF8' },
          verifiedCircle: { value: '#F0ECFF' },
          verifiedStroke: { value: '#5542D6' },
        },
        background: {
          page: { value: '#f7f8fa' },    // Full-page background (auth, dashboard, onboarding)
          section: { value: '#F7F8FA' }, // Alternating light section bg on landing pages
          subtle: { value: '#F8F9FF' },  // Admin / select-panel page bg (slight purple tint)
          card: { value: '#FFFFFF' },    // White cards/boxes
          white: { value: '#FFFFFF' },   // Explicit white (same value, clearer intent)
          lightBlue: { value: '#C7DCFD' },
          input: { value: '#FFFFFF' },   // Input backgrounds
          hover: { value: '#5851BF' },   // Link text
        },
        text: {
          heading: { value: '#27262D' },
          primary: { value: '#000000' }, // Main text
          white: { value: '#FFFFFF' }, // White cards/boxes
          secondary: { value: '#575C62' }, // Muted text
          link: { value: '#5851BF' }, // Link text
          error: { value: '#E53E3E' }, // Error messages
          businessH: { value: '#1F2937' }, // Business profile page heading
        },
        border: {
          accentBorder: { value: '#E9EAED' }, // Use border on elements
          default: { value: '#DCDFE3' }, // Input borders
          subtle: { value: '#D2D2D8' }, // Lighter border for cards
          focus: { value: '#2F2B77' }, // Focus state
          error: { value: '#FC8181' }, // Error state
        },
      },
      fontSizes: {
        bigheading: { value: '32px' },
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

    semanticTokens: {
      fontSizes: {
        // Responsive overrides — desktop values match the static tokens above.
        // base = mobile (< 1024px), lg = desktop (≥ 1024px)
        // bigheading: { value: { base: '24px', lg: '32px' } },
        // heading: { value: { base: '20px', lg: '24px' } },
        // subheading: { value: { base: '16px', lg: '18px' } },
      },
    },

    recipes: {
      button: buttonRecipe,
      input: inputRecipe,
    },
  },
});

export const system = createSystem(defaultConfig, config);
