import { ChatGPTMessage } from "@/types";

export default function isLastAnswer(messages: ChatGPTMessage[]) {
  return messages.filter((msg) => msg.role === "assistant").length >= 2;
}
