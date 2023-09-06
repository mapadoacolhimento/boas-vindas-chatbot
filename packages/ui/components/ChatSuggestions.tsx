import { Box, Stack, Button, Text } from "@chakra-ui/react";

const suggestions = [
  {
    text: "Tipos de serviço público",
  },
  {
    text: "Mapa de serviços públicos",
  },
  {
    text: "Como fazer para encaminhar?",
  },
  {
    text: "Como denunciar?",
  },
  {
    text: "Como fazer a articulação?",
  },
];

const ChatSuggestions = ({
  handleClick,
}: {
  handleClick: (text: string) => void;
}) => (
  <Box px={6} pb={4} w={"full"}>
    <Text
      display={{ base: "none", sm: "initial" }}
      fontSize="sm"
      fontWeight="700"
      color="brand.primary"
    >
      Não sabe como começar? Temos algumas sugestões de conteúdo:
    </Text>
    <Text
      display={{ base: "initial", sm: "none" }}
      fontSize="sm"
      fontWeight="700"
      color="brand.primary"
    >
      Sugestões de conteúdo:
    </Text>
    <Stack
      direction={["column", "row"]}
      wrap="wrap"
      alignItems="flex-start"
      pt={4}
    >
      {suggestions.map(({ text }, index) => (
        <Button
          key={index}
          variant={"option"}
          size={"sm"}
          fontWeight="400"
          onClick={() => handleClick(text)}
        >
          {text}
        </Button>
      ))}
    </Stack>
  </Box>
);

export default ChatSuggestions;
