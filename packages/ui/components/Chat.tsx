"use client";

import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Box, VStack } from "@chakra-ui/react";

import ChatLine, { type ChatGPTMessage, LoadingChatLine } from "./ChatLine";
import { ChatSuggestions, InputMessage } from "@/components";

const COOKIE_NAME = "nextjs-example-ai-chat-gpt3";

// default first message to display in UI (not necessary to define the prompt)
export const initialMessages: ChatGPTMessage[] = [
  {
    role: "assistant",
    content:
      "Oie Ângela, Eu sou a IAna, uma assistente criada para auxiliar seu treinamento, fornecendo informações e respostas sobre serviços públicos. Meu objetivo é oferecer um suporte acolhedor e informativo. Como posso ajudar você hoje?",
  },
];

export default function Chat() {
  const [messages, setMessages] = useState<ChatGPTMessage[]>(initialMessages);
  const [input, setInput] = useState("");
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
    setLoading(true);
    const newMessages = { role: "user", content: message } as ChatGPTMessage;
    setMessages((prevMessages) => [...prevMessages, newMessages]);

    // const last10messages = newMessages.slice(-10); // remember last 10 messages

    const response = await fetch(`/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: { role: "user", content: message },
        user: cookie[COOKIE_NAME],
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();
    if (!data) {
      return;
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "assistant", content: data } as ChatGPTMessage,
    ]);

    setLoading(false);
  };

  function handleClick(text: string) {
    setInput(text);
  }

  return (
    <VStack boxSize={"full"} align={"flex-start"} justify={"flex-end"}>
      <Box overflowY={"auto"} maxH={"lg"} w={"full"} minH={56}>
        {messages.map(({ content, role }, index) => (
          <ChatLine key={index} role={role} content={content} />
        ))}
      </Box>

      {loading && <LoadingChatLine />}

      {messages.length < 2 && <ChatSuggestions handleClick={handleClick} />}

      <InputMessage
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
      />
    </VStack>
  );
}
