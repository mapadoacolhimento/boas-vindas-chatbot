'use client';

import { useEffect } from 'react';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import { init as initAmplitude } from '@amplitude/analytics-browser';
import theme from '../theme';

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const AMPLITUDE_API_KEY =
      process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
    initAmplitude(AMPLITUDE_API_KEY || '', undefined, {
      defaultTracking: {
        sessions: true,
      },
    });
  }, []);

  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </CacheProvider>
  );
}
