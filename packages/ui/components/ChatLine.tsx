import { Box, Divider, HStack, Text, VStack } from "@chakra-ui/react";
import UserQueryIcon from "./UserQueryIcon";
import ChatIcon from "./ChatIcon";

// wrap Balancer to remove type errors :( - @TODO - fix this ugly hack
// const BalancerWrapper = (props: any) => <Balancer {...props} />

type ChatGPTAgent = "user" | "system" | "assistant";

export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
}

// loading placeholder animation for the chat line
export const LoadingChatLine = () => (
  <div className="flex min-w-full animate-pulse px-4 py-5 sm:px-6">
    <div className="flex flex-grow space-x-3">
      <div className="min-w-0 flex-1">
        <p className="font-large text-xxl text-gray-900">
          <a href="#" className="hover:underline">
            AI
          </a>
        </p>
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 h-2 rounded bg-zinc-500"></div>
            <div className="col-span-1 h-2 rounded bg-zinc-500"></div>
          </div>
          <div className="h-2 rounded bg-zinc-500"></div>
        </div>
      </div>
    </div>
  </div>
);

// util helper to convert new lines to <br /> tags
const convertNewLines = (text: string) =>
  text.split("\n").map((line, i) => (
    <span key={i}>
      {line}
      <br />
    </span>
  ));

export default function ChatLine({
  role = "assistant",
  content,
}: ChatGPTMessage) {
  if (!content) {
    return null;
  }

  const formatteMessage = convertNewLines(content);

  return (
    <VStack 
      spacing={0} 
      align={"flex-start"} 
      justify={"flex-start"}
    >
      <Box
        bgColor={role === "assistant" ? "chatBackground" : "white"}
        py={"15px"}
        px={8}
        width={"full"}
      >
        <HStack
          alignItems="flex-start" 
          spacing={"10px"}
        >
          {role === "assistant" ? (
            <ChatIcon boxSize={"14px"} />
          ) : (
            <UserQueryIcon boxSize={"14px"} />
          )}
          <Text
            color={"text"}
            fontSize={"sm"}
            height={"fit-content"}
            w={"full"}
          >
            {formatteMessage}
          </Text>
        </HStack>
      </Box>
      <Box px={8} w={"full"}>
        <Divider height={"1px"} bgColor={"#eee"} w={"full"} />
      </Box>
    </VStack>
  );
}
