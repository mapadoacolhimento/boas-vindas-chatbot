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
  <Box
    pl="1.5rem"
    pb="1rem"
    fontSize="1rem"
    fontWeight="600"
    color="brand.default"
  >
    <Text>Não sabe como começar? Temos algumas sugestões de conteúdo:</Text>
    <Stack
      direction={[ "column", "row" ]}
      wrap="wrap"
      alignContent="flex-start"
      pt="1rem"

    >
      {suggestions.map(({ text }, index) => (
        <Button
          key={index}
          border="1px solid"
          borderColor="brand.lightGray"
          borderRadius="0.5rem"
          color="brand.darkGray"
          bg="white"
          fontSize="0.689rem"
          size="sm"
          
          _hover={{
            bg:".brand.lightGray"
          }}
          _focus={{
            bg:"brand.lightGray"
          }}
        >
          {text}
        </Button>       
      ))}
    </Stack>
  </Box>
)

export default ChatSuggestions;