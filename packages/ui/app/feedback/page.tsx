"use client";

import { useState } from "react";
import { useConst } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";

import { Chat, ChatLayout } from "@/components";
import {
  extractAnswersFromMessages,
  getValueFromParams,
  isLastFeedbackQuestion,
} from "@/utils";
import { ChatGPTMessage } from "@/types";

const initialMessages = (name: string): ChatGPTMessage[] => [
  {
    role: "assistant",
    content: `Oie, ${name}! 
    Agora que você chegou no fim da capacitação, gostaríamos de saber como foi a sua experiência. 💜

    Primeiro, me conta: qual foi sua percepção ao interagir com a IAna? 
    `,
  },
];

function shouldSaveVolunteerFeedback(messages: ChatGPTMessage[]) {
  if (!isLastFeedbackQuestion(messages)) return false;

  const { rating, firstAnswer } = extractAnswersFromMessages(messages);

  return rating !== null && firstAnswer.length > 0;
}

async function saveVolunteerFeedback(
  messages: ChatGPTMessage[],
  userId: string
) {
  try {
    const { rating, firstAnswer } = extractAnswersFromMessages(messages);

    await fetch(`/api/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstAnswer: firstAnswer.join(" "),
        rating,
        userId,
      }),
    });
  } catch (error) {
    console.error(error);
  }
}

function Feedback() {
  const searchParams = useSearchParams();
  const { name, city, userId } = useConst(getValueFromParams(searchParams));
  const [messages, setMessages] = useState<ChatGPTMessage[]>(
    initialMessages(name)
  );
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: string) => {
    try {
      setLoading(true);

      const newMessage = { role: "user", content: message } as ChatGPTMessage;
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, newMessage];

        if (shouldSaveVolunteerFeedback(newMessages)) {
          saveVolunteerFeedback(newMessages, userId);
        }

        return newMessages;
      });

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
        messages={messages.filter((m) => m.role !== "system")}
        setMessages={setMessages}
        city={city}
        showSuggestions={false}
      />
    </ChatLayout>
  );
}

export default Feedback;
