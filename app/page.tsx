"use client";

import { Chat } from "../components";
import { Text, Box, HStack, VStack, Heading } from "@chakra-ui/react";
import Image from "next/image";

function ChatHeader() {
  return (
    <HStack
      w={"full"}
      minH={"60px"}
      borderBottom="1px solid #EFEFEF"
      gap="1rem"
      align={"center"}
      pl={"32px"}
    >
      <Box p="6px" borderRadius="3px" bg="#FFDBDB">
        <Image
          src="/icons/icon-good-msg.svg"
          alt="Icon de mensagem"
          height={13.69}
          width={13.69}
        />
      </Box>
      <Heading
        as={"h2"}
        color="brand.default"
        fontSize="15px"
        fontWeight="bold"
      >
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
        maxH={"686px"}
        bg="white"
        border="1px solid #C4C4C4"
        borderRadius="0.625rem"
        boxShadow="0px 4px 4px 0px #00000040"
        pb={"36px"}
      >
        <ChatHeader />
        <Chat />
      </VStack>
    </VStack>
  );
}

export default Home;