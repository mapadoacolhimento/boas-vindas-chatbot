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
      "Oie Ângela, Eu sou a aIAna, uma assistente criada para auxiliar seu treinamento, fornecendo informações e respostas sobre serviços públicos. Meu objetivo é oferecer um suporte acolhedor e informativo. Como posso ajudar você hoje?",
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
    const newMessages = [
      ...messages,
      { role: "user", content: message } as ChatGPTMessage,
    ];
    setMessages(newMessages);
    // const last10messages = newMessages.slice(-10); // remember last 10 messages

    const response = await fetch(`/api`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: { role: "user", content: message },
        user: cookie[COOKIE_NAME],
      }),
    });

    console.log("Edge function returned.");

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    let lastMessage = "";

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      lastMessage = lastMessage + chunkValue;

      setMessages([
        ...newMessages,
        { role: "assistant", content: lastMessage } as ChatGPTMessage,
      ]);

      setLoading(false);
    }
  };

  return (
    <VStack boxSize={"full"} align={"flex-start"} justify={"flex-end"}>
      <Box overflowY={"auto"} maxH={"lg"} w={"full"} minH={56}>
        {messages.map(({ content, role }, index) => (
          <ChatLine key={index} role={role} content={content} />
        ))}
      </Box>

      {loading && <LoadingChatLine />}

      {messages.length < 2 && <ChatSuggestions />}
      <InputMessage
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
      />
    </VStack>
  );
}
