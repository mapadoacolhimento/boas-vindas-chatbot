"use client";

import { useState } from "react";
import { useConst } from "@chakra-ui/react";
import { Chat, ChatLayout } from "@/components";
import { ChatGPTMessage } from "@/components/ChatLine";
import { useSearchParams } from "next/navigation";

const initialMessages = (name: string): ChatGPTMessage[] => [
  {
    role: "assistant",
    content: `Oie, ${name}! \nEu sou a IAna, uma assistente criada para auxiliar seu treinamento, fornecendo informações e respostas sobre serviços públicos. Meu objetivo é oferecer um suporte acolhedor e informativo. Como posso ajudar você hoje?`,
  },
];

function Home() {
  const searchParams = useSearchParams();
  const name = useConst(searchParams.get("name") || "Voluntária");
  const city = useConst(searchParams.get("city"));
  const [messages, setMessages] = useState<ChatGPTMessage[]>(
    initialMessages(name)
  );
  const [loading, setLoading] = useState(false);

  // send message to API /api/chat endpoint
  const sendMessage = async (message: string) => {
    try {
      setLoading(true);
      const newMessage = { role: "user", content: message } as ChatGPTMessage;
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      const response = await fetch(`/api/chat`, {
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
    <ChatLayout>
      <Chat
        loading={loading}
        sendMessage={sendMessage}
        messages={messages}
        setMessages={setMessages}
        city={city}
        showSuggestions
      />
    </ChatLayout>
  );
}

export default Home;
