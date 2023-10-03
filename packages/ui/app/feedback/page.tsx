"use client";

import { useState } from "react";
import { HStack, VStack, Heading, Center, useConst } from "@chakra-ui/react";
import { Chat, ChatIcon } from "@/components";
import { ChatGPTMessage } from "@/components/ChatLine";
import { useSearchParams } from "next/navigation";

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

const initialMessages = (name: string): ChatGPTMessage[] => [
  {
    role: "assistant",
    content: `Oie, ${name}! 
    Agora que você chegou no fim da capacitação, gostaríamos de saber como foi a sua experiência. 💜

    Primeiro, me conta: qual foi sua percepção ao interagir com a IAna? 
    `,
  },
];

function Feedback() {
  const searchParams = useSearchParams();
  const name = useConst(searchParams.get("name") || "Voluntária");
  const city = useConst(searchParams.get("city"));
  const [messages, setMessages] = useState<ChatGPTMessage[]>(
    initialMessages(name)
  );
  const [loading, setLoading] = useState(false);

  const extractAnswers = async (newMessage: ChatGPTMessage) => {
    const extractAnswersInstruction = {
      role: "system",
      content:
        "IAna, me retorne APENAS um array com 4 elementos, em que cada elemento é EXATAMENTE igual a resposta da usuária para cada uma das 4 perguntas, na ordem em que elas foram feitas. Os elementos do array devem ser EXATAMENTE a resposta da usuária, não acrescente nada. Você deve retornar APENAS o array na sua próxima mensagem, NÃO acrescente mais nada.",
    } as ChatGPTMessage;

    const extractAnswersResponse = await fetch(`/api/chat/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: extractAnswersInstruction,
        user: {
          name,
          city,
        },
        chatHistory: [...messages, newMessage],
      }),
    });

    if (!extractAnswersResponse.ok) {
      throw new Error(extractAnswersResponse.statusText);
    }

    const data = await extractAnswersResponse.json();
    const answers = JSON.parse(data);
    answers.map((answer: string, index: number) => {
      console.log(`Resposta para a pergunta ${index}: ${answer}`);
    });
  };

  // send message to API /api/chat endpoint
  const sendMessage = async (message: string) => {
    try {
      setLoading(true);

      const newMessage = { role: "user", content: message } as ChatGPTMessage;
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      const response = await fetch(`/api/chat/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessage,
          user: {
            name,
            city,
          },
          chatHistory: messages,
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      const noDataErrorMsg =
        "Ops... um problema inesperado ocorreu. Aguarde alguns instantes e tente novamente.";

      if (data.includes("Até mais!")) {
        console.log("acabou a conversa");
        extractAnswers(newMessage);
      }

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
    <VStack spacing="10em" justify={"center"}>
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
          city={city}
          showSuggestions={false}
        />
      </VStack>
    </VStack>
  );
}

export default Feedback;
