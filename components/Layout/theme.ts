// Supports weights 100-900
import { ChakraProviderProps, extendTheme } from '@chakra-ui/react';

export const theme: ChakraProviderProps['theme'] = extendTheme({
  fonts: {
    body: 'Inter Variable, sans-serif',
    heading: 'Inter Variable, sans-serif'
  },
  colors: {
    primary: {
      50: '#e3f2fd',
      100: '#bbdefb',
      200: '#90caf9',
      300: '#64b5f6',
      400: '#42a5f5',
      500: '#2196f3', // primary color
      600: '#1e88e5',
      700: '#1976d2',
      800: '#1565c0',
      900: '#0d47a1'
    },
    secondary: {
      50: '#f5f5f5',
      100: '#eeeeee',
      200: '#e0e0e0',
      300: '#bdbdbd',
      400: '#9e9e9e',
      500: '#757575', // secondary color
      600: '#616161',
      700: '#424242',
      800: '#303030',
      900: '#212121'
    },
    accent: {
      50: '#fff8e1',
      100: '#ffecb3',
      200: '#ffe082',
      300: '#ffd54f',
      400: '#ffca28',
      500: '#ffc107', // accent color
      600: '#ffb300',
      700: '#ffa000',
      800: '#ff8f00',
      900: '#ff6f00'
    }
  },
  components: {}
});
