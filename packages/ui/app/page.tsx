"use client";

import { HStack, VStack, Heading, Center } from "@chakra-ui/react";
import { Chat, ChatIcon } from "../components";

function ChatHeader() {
  return (
    <HStack
      w={"full"}
      minH={16}
      borderBottom="1px solid #EFEFEF"
      gap={4}
      align={"center"}
      pl={8}
    >
      <Center boxSize={7} borderRadius={"base"} bg="#FFDBDB">
        <ChatIcon boxSize={3.5} aria-label="Icon de mensagem" />
      </Center>
      <Heading as={"h2"} color="brand.default" size={"sm"}>
        Fale com a IAna
      </Heading>
    </HStack>
  );
}

function Home() {
  return (
    <VStack spacing="10em" justify={"center"}>
      <Heading>Exemplo de chat</Heading>
      <VStack
        w={{ base: "full", lg: "80%" }}
        maxH={"3xl"}
        bg="white"
        border="1px solid #C4C4C4"
        borderRadius="0.625rem"
        boxShadow={"0px 2px 2px 0px rgba(0, 0, 0, 0.10)"}
        pb={9}
      >
        <ChatHeader />
        <Chat />
      </VStack>
    </VStack>
  );
}

export default Home;