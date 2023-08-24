'use client';

import { Page } from "@vercel/examples-ui";
import { Chat } from "../components/Chat";
import { Stack, Text, Box, Center, Divider, Flex, Spacer } from '@chakra-ui/react'
import {extendTheme} from '@chakra-ui/react'
import Image from 'next/image'
 

function Home() {
  return (
    <Page>
      <Stack direction={['column']} spacing='10em'>
        <Box w='100%' h='32px'>
          <section>
            <Center fontSize='4xl' bg='white' h='100px' color='black'>
                Exemplo de chat
            </Center>    
          </section>
        </Box>  
        <Box w='54.5rem' h='22.5625rem' bg='#FFF' border='1px solid #C4C4C4'         borderRadius='0.625rem' >
        <section>
          <Flex pb='0.72rem' pt='1.31rem' pl='1.56rem' 
          borderBottom='1px solid #EFEFEF'>
            <Box p='6px' borderRadius='3px' bg='#FFDBDB'>
              <Image src='/icons/icon-good-msg.svg' alt='Icon de mensagem'
              height={13.69} width={13.69} />
            </Box>
            <Box>
              <Text variant="h2">Fale com a IAna</Text>
            </Box>
          </Flex>
          <div>
            <Chat />
          </div>
        </section>
        </Box>       
      </Stack>      
    </Page> 
  );
}


export default Home;
