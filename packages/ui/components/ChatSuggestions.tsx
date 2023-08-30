import { Box, Text, Stack, Button } from "@chakra-ui/react";

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
  <Box
    pl="1.5rem"
    pb="1rem"
    fontSize="1rem"
    fontWeight="600"
    color="brand.default"
  >
    <Text>Não sabe como começar? Temos algumas sugestões de conteúdo:</Text>
    <Stack
      direction="row"
      pt="1rem"

    >
      {suggestions.map(({ text }, index) => (
        <Button
          key={index}
          border="1px solid #E0E0E0"
          borderRadius="0.5rem"
          color="brand.darkGray"
          bg="white"
          fontSize="0.689rem"
          size="sm"
          _hover={{
            bg:"#EFEFEF"
          }}
          _active={{
            bg:"#EFEFEF"
          }}
        >
          {text}
        </Button>       
      ))}
    </Stack>
  </Box>
)

export default ChatSuggestions;