'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import '@fontsource/nunito/400.css'
import theme from './theme'

export function Providers({ 
    children 
  }: { 
  children: React.ReactNode  
  }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    </CacheProvider>
  )
}