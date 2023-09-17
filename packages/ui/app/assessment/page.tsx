"use client";

import { HStack, VStack, Heading, Center } from "@chakra-ui/react";
import { Chat, ChatIcon } from "../../components";
import { ChatGPTMessage } from "@/components/ChatLine";

function ChatHeader() {
  return (
    <HStack
      w={"full"}
      minH={16}
      borderBottom="1px solid"
      borderColor="brand.lightGray"
      gap={4}
      align={"center"}
      pl={8}
    >
      <Center boxSize={7} borderRadius={"base"} bg="#FFDBDB">
        <ChatIcon boxSize={3.5} aria-label="Icon de mensagem" />
      </Center>
      <Heading as={"h2"} color="brand.primary" size={"sm"} fontWeight="700">
        Fale com a IAna
      </Heading>
    </HStack>
  );
}

export const initialMessages: ChatGPTMessage[] = [
  {
    role: "assistant",
    content:
      "Oie, Viviane! \nEu sou a IAna, uma assistente criada para auxiliar seu treinamento, fornecendo informações e respostas sobre serviços públicos. Meu objetivo é oferecer um suporte acolhedor e informativo. Como posso ajudar você hoje?",
  },
];

function Assessment() {
  return (
    <VStack spacing="10em" justify={"center"} px={4} py={6}>
      <VStack
        w={{ base: "full", lg: "80%" }}
        maxH={"3xl"}
        bg="white"
        border="1px solid #C4C4C4"
        borderRadius="0.625rem"
        boxShadow={"0px 4px 4px 0px rgba(0, 0, 0, 0.10)"}
        pb={9}
        spacing={0}
      >
        <ChatHeader />
        <Chat initialMessages={initialMessages} />
      </VStack>
    </VStack>
  );
}

export default Assessment;
