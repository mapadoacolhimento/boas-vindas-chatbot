import { Box, Stack, Button, Text } from "@chakra-ui/react";

const suggestions = [
  {
    text: "Tipos de serviço público",
  },
  {
    text: "Mapa de serviços públicos",
  },
  {
    text: "Como identificar se precisa de encaminhamento",
  },
  {
    text: "Como denunciar?",
  },
  {
    text: "Como fazer a articulação?",
  },
];

const ChatSuggestions = () => (
  <Box px={6} pb={4} w={"full"}>
    <Text
      display={{ base: "none", sm: "initial" }}
      fontSize="sm"
      fontWeight="semibold"
      color="brand.primary"
    >
      Não sabe como começar? Temos algumas sugestões de conteúdo:
    </Text>
    <Text
      display={{ base: "initial", sm: "none" }}
      fontSize="sm"
      fontWeight="semibold"
      color="brand.primary"
    >
      Sugestões de conteúdo:
    </Text>
    <Stack
      direction={["column", "row"]}
      wrap="wrap"
      alignContent="flex-start"
      pt={4}
    >
      {suggestions.map(({ text }, index) => (
        <Button
          key={index}
          variant={"option"}
          size={"sm"}
          w={"full"}
          fontSize={"xs"}
        >
          {text}
        </Button>
      ))}
    </Stack>
  </Box>
);

export default ChatSuggestions;
