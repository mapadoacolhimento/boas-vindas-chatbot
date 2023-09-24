"use client";

import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Box, VStack } from "@chakra-ui/react";

import ChatLine, { type ChatGPTMessage, LoadingChatLine } from "./ChatLine";
import { ChatSuggestions, InputMessage } from "@/components";

export default function Chat({
  messages,
  setMessages,
  sendMessage,
  loading,
  showSuggestions,
}: {
  messages: ChatGPTMessage[];
  setMessages: Dispatch<SetStateAction<ChatGPTMessage[]>>;
  sendMessage: (msg: string) => Promise<void>;
  loading: boolean;
  showSuggestions: boolean;
}) {
  const [input, setInput] = useState("");
  const messageEl = useRef<HTMLDivElement | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Update network status
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    // Listen to the online status
    window.addEventListener("online", handleStatusChange);

    // Listen to the offline status
    window.addEventListener("offline", handleStatusChange);

    // Specify how to clean up after this effect for performance improvment
    return () => {
      window.removeEventListener("online", handleStatusChange);
      window.removeEventListener("offline", handleStatusChange);
    };
  }, [isOnline]);

  useEffect(() => {
    if (!isOnline) {
      const messageWithNoConnectError = {
        role: "assistant",
        content:
          "Parece que você está sem conexão! Verifique sua internet e tente novamente",
      } as ChatGPTMessage;
      setMessages((prevMessages) => [
        ...prevMessages,
        messageWithNoConnectError,
      ]);
    }
  }, [isOnline, setMessages]);

  useEffect(() => {
    if (messageEl && messageEl.current) {
      messageEl.current.addEventListener("DOMNodeInserted", (event: any) => {
        const { currentTarget: target } = event;
        if (!target) return null;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
  }, []);

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

      {showSuggestions && messages.length < 2 && (
        <ChatSuggestions handleClick={handleClick} />
      )}

      <InputMessage
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
      />
    </VStack>
  );
}
