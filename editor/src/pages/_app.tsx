import '@fontsource/inter';
import '@fontsource/work-sans';
import '../components/AppMain.css';
import '../components/Card.css';
import '../styles/globals.css';

import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { withProse } from '@nikolovlazar/chakra-ui-prose';
import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app';
import reportWebVitals from '../reportWebVitals';

const theme = extendTheme(
  {
    fonts: {
      heading: `Work Sans, system-ui, sans-serif`,
      body: `Inter, system-ui, sans-serif`,
    },
  },
  withProse()
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
        <Analytics />
      </ChakraProvider>
    </SessionProvider>
  );
}

initializeIcons();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
