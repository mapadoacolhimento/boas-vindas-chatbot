import { ChatGPTMessage } from "@/types";

function getNumberFromString(msg: string) {
  const msgWithDots = msg.replace(/,/, ".");
  const regex = /[+-]?\d+(\.\d+)?/g;
  const match = msgWithDots.match(regex);
  const rating = match && match.length > 0 ? parseFloat(match[0]) : null;

  return !rating || Number.isNaN(rating) ? null : rating;
}

function isValidRating(rating: number) {
  return rating >= 0 && rating <= 5;
}

export default function extractAnswersFromMessages(messages: ChatGPTMessage[]) {
  const secondAssistantQuestionIndex = messages.findIndex(
    (msg) => msg.content.includes("0 a 5") && msg.role === "assistant"
  );

  const firstAnswer = messages
    .slice(1, secondAssistantQuestionIndex)
    .filter((msg) => msg.role === "user")
    .map((msg) => msg.content);

  const secondAnswer = messages
    .slice(secondAssistantQuestionIndex + 1)
    .filter((msg) => msg.role === "user")
    .find((msg) => {
      const msgHasNumber = getNumberFromString(msg.content);
      if (!msgHasNumber) return false;
      return isValidRating(msgHasNumber);
    });
  const rating = secondAnswer
    ? getNumberFromString(secondAnswer.content)
    : null;

  return {
    rating,
    firstAnswer,
  };
}
