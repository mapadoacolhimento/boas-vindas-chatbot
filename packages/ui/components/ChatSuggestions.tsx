import { Box, Text, Stack, Button, Wrap } from "@chakra-ui/react";

const suggestions = [
  {
    text: "Tipos de serviço público"
  },
  {
    text: "Mapa de serviços públicos"
  },
  {
    text: "Como identificar se precisa de encaminhamento"
  },
  {
    text: "Como denunciar?"
  },
  {
    text: "Como fazer a articulação?"
  }
]

const ChatSuggestions = ({}: any) => (
  <Box px={6} pb={4}>
    <Text fontSize="sm" fontWeight="semibold" color="brand.primary">
      Não sabe como começar? Temos algumas sugestões de conteúdo:
    </Text>
    <Stack direction="row" wrap="wrap" pt="1rem">
      {suggestions.map(({ text }, index) => (
        <Button key={index} variant={"option"} size={"sm"}>
          {text}
        </Button>
      ))}
    </Stack>
  </Box>
);

export default ChatSuggestions;