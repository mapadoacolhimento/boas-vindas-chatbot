"use client";

import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { HStack, VStack, Heading, Center } from "@chakra-ui/react";
import { Chat, ChatIcon } from "@/components";
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
    content: `Oie, Viviane! 
    Agora vamos avaliar o seu aprendizado. Eu vou te fazer uma pergunta e você me manda uma resposta bem completa.
    Bora começar?`,
  },
];

const COOKIE_NAME = "nextjs-example-ai-chat-gpt3";

function Assessment() {
  const [messages, setMessages] = useState<ChatGPTMessage[]>(initialMessages);

  const [loading, setLoading] = useState(false);
  const [cookie, setCookie] = useCookies([COOKIE_NAME]);

  useEffect(() => {
    if (!cookie[COOKIE_NAME]) {
      // generate a semi random short id
      const randomId = Math.random().toString(36).substring(7);
      setCookie(COOKIE_NAME, randomId);
    }
  }, [cookie, setCookie]);

  // send message to API /api/chat endpoint
  const sendMessage = async (message: string) => {
    try {
      setLoading(true);
      const newMessage = { role: "user", content: message } as ChatGPTMessage;
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      const response = await fetch(`/api/chat/assessment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessage,
          user: cookie[COOKIE_NAME],
          chatHistory: messages,
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      const noDataErrorMsg =
        "Ops... um problema inesperado ocorreu. Aguarde alguns instantes e tente novamente.";

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: data || noDataErrorMsg,
        } as ChatGPTMessage,
      ]);
      setLoading(false);
    } catch (error) {
      console.error(error);
      const messageWithError = {
        role: "assistant",
        content:
          "Ops... Algo deu errado!\n Não estamos conseguindo carregar o chat com a IAna. Por favor, tente novamente mais tarde!",
      } as ChatGPTMessage;
      setMessages((prevMessages) => [...prevMessages, messageWithError]);
      setLoading(false);
    }
  };

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
        <Chat
          loading={loading}
          sendMessage={sendMessage}
          messages={messages.filter((m) => m.role !== "system")}
          setMessages={setMessages}
        />
      </VStack>
    </VStack>
  );
}

export default Assessment;
