"use client";

import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { Box, VStack } from "@chakra-ui/react";

import ChatLine, { type ChatGPTMessage, LoadingChatLine } from "./ChatLine";
import { ChatSuggestions, InputMessage } from "@/components";
import { text } from "stream/consumers";
import { Assistant } from "next/font/google";

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
  const messageEl = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messageEl && messageEl.current) {
      messageEl.current.addEventListener("DOMNodeInserted", (event: any) => {
        const { currentTarget: target } = event;
        if (!target) return null;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
  }, []);

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

    let response;
    try {
      response = await fetch(`/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: { role: "user", content: message },
          user: cookie[COOKIE_NAME],
        }),
      });
    } catch (error) {
      const messageWithError = { 
        role: "assistant", 
        content: "Parece que você está sem conexão! Verifique sua internet e tente novamente"
      } as ChatGPTMessage;
      setMessages((prevMessages) => [...prevMessages, messageWithError]);
      setLoading(false);
      return;
    }

    console.log(`Edge function returned.`);

    if (!response.ok) {
      setLoading(false);
      const messageErrorUi = {
        role: "assistant",
        content: "Ops... Algo deu errado!\n Não estamos conseguindo carregar o chat com a IAna. Por favor, tente novamente mais tarde!"
      } as ChatGPTMessage;
      setMessages((prevMessages) => [...prevMessages, messageErrorUi]);
      return;
    }

    const data = await response.json();
    
    if (!data || Object.keys(data).length === 0) {
      setLoading(false);
      const messageErrorResponse = {
        role: "assistant",
        content: "Ops... Algo deu errado!\n Não estamos conseguindo carregar o chat com a IAna. Por favor, tente novamente mais tarde!"
      } as ChatGPTMessage;
      setMessages((prevMessages) => [...prevMessages, messageErrorResponse]);
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
      <Box overflowY={"auto"} maxH={"lg"} w={"full"} minH={56} ref={messageEl}>
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
