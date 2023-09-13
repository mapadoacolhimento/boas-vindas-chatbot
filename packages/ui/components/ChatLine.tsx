import { Box, Divider, HStack, Text, VStack } from "@chakra-ui/react";
import UserQueryIcon from "./UserQueryIcon";
import ChatIcon from "./ChatIcon";

import styles from "../styles/loadingState.module.css";

// wrap Balancer to remove type errors :( - @TODO - fix this ugly hack
// const BalancerWrapper = (props: any) => <Balancer {...props} />

type ChatGPTAgent = "user" | "system" | "assistant";

export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
}

// loading placeholder animation for the chat line
export const LoadingChatLine = () => (
  <Box className={styles.container}>
    <Box className={styles.tiblock}>
      <Box className={styles.tidot}></Box>
      <Box className={styles.tidot}></Box>
      <Box className={styles.tidot}></Box>
    </Box> 
  </Box>
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
    <VStack spacing={0} align={"flex-start"} justify={"flex-start"}>
      <Box
        bgColor={role === "assistant" ? "chatBackground" : "white"}
        py={4}
        pl={8}
        pr={{ base: 8, md: 20 }}
        width={"full"}
      >
        <HStack alignItems="flex-start" spacing={2.5}>
          {role === "assistant" ? (
            <ChatIcon boxSize={3.5} />
          ) : (
            <UserQueryIcon boxSize={3.5} />
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
