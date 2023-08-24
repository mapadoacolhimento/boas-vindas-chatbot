'use client';

import { Page } from "@vercel/examples-ui";
import { Chat } from "../components/Chat";
<<<<<<< Updated upstream
import { Stack, Text, Box, Center, Divider, Flex, Spacer } from '@chakra-ui/react'
import {extendTheme} from '@chakra-ui/react'
import Image from 'next/image'
 
=======
import { Stack, Text, Box, Center, Flex } from "@chakra-ui/react";
import Image from "next/image";
>>>>>>> Stashed changes


 
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
<<<<<<< Updated upstream
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
=======
        <Box w="54.5rem" h="22.5625rem" border="1px solid #C4C4C4"         borderRadius="10px"  boxShadow=' 0px 4px 4px 0px #00000040' bg="white">
          <section>
            <Flex pb="0.72rem" pt="1.31rem" pl="1.56rem" 
            borderBottom="1px solid #EFEFEF" gap="10px">
              <Box p="6px" borderRadius="3px" bg="#FFDBDB">
                <Image src="/icons/icon-good-msg.svg" alt="Icon de mensagem"
                height={13.69} width={13.69} />
              </Box>      
              <Center>
                <Box color="#622565">
                  <Text variant="h2">Fale com a IAna</Text>
                </Box>
              </Center> 
            </Flex>
            <div>
              <Chat />
            </div>
          </section>
>>>>>>> Stashed changes
        </Box>       
      </Stack>      
    </Page> 
  );
}


export default Home;
