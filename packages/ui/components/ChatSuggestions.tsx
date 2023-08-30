import { Box, Text, Flex, Button } from "@chakra-ui/react"

const ChatSuggestions = ({}: any) => (
  <Box
    pl="1.5rem"
    pb="1rem"
    fontSize="1rem"
    fontWeight="600"
    color="brand.default"
  >
    <Text>Não sabe como começar? Temos algumas sugestões de conteúdo:</Text>
    <Flex
      direction="row"
      pt="1rem"
    >
      <Button
        p="0.312 0.437 0.37 0.437"
        border="1px solid #E0E0E0"
        borderRadius="0.5rem"
        color="brand.darkGray"
        bg="#FFFFF"
        fontSize="0.687rem"
        _hover={{
          bg:"#EFEFEF"
        }}
      >
        Tipos de serviço público</Button>
    </Flex>
  </Box>
)

export default ChatSuggestions;