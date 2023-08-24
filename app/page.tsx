"use client";

import { Chat } from "../components";
import { Text, Box, Flex, VStack, Heading } from "@chakra-ui/react";
import Image from "next/image";

function Home() {
  return (
    <VStack spacing="10em" justify={"center"}>
      <Heading>Exemplo de chat</Heading>
      <Flex w={"full"} justify={"center"}>
        <Box
          w={{ base: "full", lg: "80%" }}
          minH="22.5625rem"
          bg="#FFF"
          border="1px solid #C4C4C4"
          borderRadius="0.625rem"
        >
          <Flex
            pb="0.72rem"
            pt="1.31rem"
            pl="1.56rem"
            borderBottom="1px solid #EFEFEF"
          >
            <Box p="6px" borderRadius="3px" bg="#FFDBDB">
              <Image
                src="/icons/icon-good-msg.svg"
                alt="Icon de mensagem"
                height={13.69}
                width={13.69}
              />
            </Box>
            <Box>
              <Text variant="h2">Fale com a IAna</Text>
            </Box>
          </Flex>
          <Box>
            <Chat />
          </Box>
        </Box>
      </Flex>
    </VStack>
  );
}

export default Home;
