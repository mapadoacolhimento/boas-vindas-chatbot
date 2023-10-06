import { Center, VStack, HStack, Heading } from "@chakra-ui/react";
import ChatIcon from "./ChatIcon";

function ChatHeader() {
  return (
    <HStack
      w={"full"}
      minH={16}
      borderBottom="1px solid"
      borderColor="brand.lightGray"
      gap={4}
      align={"center"}
      pl={8}
    >
      <Center boxSize={7} borderRadius={"base"} bg="#FFDBDB">
        <ChatIcon boxSize={3.5} aria-label="Icon de mensagem" />
      </Center>
      <Heading as={"h2"} color="brand.primary" size={"sm"} fontWeight="700">
        Fale com a IAna
      </Heading>
    </HStack>
  );
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Center>
      <VStack
        w={{ base: "full", lg: "80%" }}
        maxH={"3xl"}
        bg="white"
        border="1px solid #C4C4C4"
        borderRadius="0.625rem"
        boxShadow={"0px 4px 4px 0px rgba(0, 0, 0, 0.10)"}
        pb={9}
        spacing={0}
      >
        <ChatHeader />
        {children}
      </VStack>
    </Center>
  );
}
