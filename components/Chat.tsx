"use client";

import { useEffect, useState } from "react";
import ChatLine, { type ChatGPTMessage, LoadingChatLine } from "./ChatLine";
import { useCookies } from "react-cookie";
import { Button, Input, HStack, Box, VStack } from "@chakra-ui/react";

const COOKIE_NAME = "nextjs-example-ai-chat-gpt3";

// default first message to display in UI (not necessary to define the prompt)
export const initialMessages: ChatGPTMessage[] = [
  {
    role: "assistant",
    content: "Hi! I am a friendly AI assistant. Ask me anything!",
  },
];

const InputMessage = ({ input, setInput, sendMessage }: any) => (
  <HStack spacing={4} px={6} w={"full"}>
    <Box flex="1">
      <Input
        _hover={{
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "brand.magenta",
          boxShadow: "0px 3px 10px 0px #0000001a",
        }}
        _focus={{
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "brand.magenta",
          boxShadow: "0px 3px 10px 0px #0000001a",
        }}
        placeholder="Envie sua pergunta ou dúvida e a aIAna vai te ajudar"
        _placeholder={{
          opacity: 1,
          color: "#AAA",
          size: "md",
          fontsize: "13px",
          fontWeight: "400",
        }}
        borderRadius="7px"
        border="1px solid #E0E0E0"
        type="text"
        aria-label="chat input"
        required
        value={input}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage(input);
            setInput("");
          }
        }}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />
    </Box>
    <Button
      textTransform={"uppercase"}
      bg="brand.default"
      color="white"
      _hover={{
        bg: "brand.light",
      }}
      _active={{
        bg: "brand.dark",
      }}
      type="submit"
      onClick={() => {
        sendMessage(input);
        setInput("");
      }}
    >
      Enviar
    </Button>
  </HStack>
);

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

    const response = await fetch("/api/chat", {
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
      <Box overflowY={"auto"} maxH={"lg"} w={"full"}>
        {messages.map(({ content, role }, index) => (
          <ChatLine key={index} role={role} content={content} />
        ))}
      </Box>

      {loading && <LoadingChatLine />}

      {messages.length < 2 && (
        <span>Type a message to start the conversation</span>
      )}
      <InputMessage
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
      />
    </VStack>
  );
}
