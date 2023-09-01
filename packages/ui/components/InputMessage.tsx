import { Button, Input, HStack, Box } from "@chakra-ui/react";

const InputMessage = ({ input, setInput, sendMessage }: any) => (
  <HStack spacing={4} px={6} w={"full"}>
    <Box flex="1">
      <Input
        _hover={{
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "brand.mediumPurple",
          boxShadow: "0px 3px 10px 0px #0000001a",
        }}
        _focus={{
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "brand.mediumPurple",
          boxShadow: "0px 3px 10px 0px #0000001a",
        }}
        placeholder="Envie sua pergunta ou dúvida e a aIAna vai te ajudar"
        _placeholder={{
          opacity: 1,
          color: "#AAA",
          size: "md",
          fontsize: "13px",
          fontWeight: "400",
        }}
        borderRadius="7px"
        border="1px solid"
        borderColor="brand.lightGray"
        type="text"
        aria-label="chat input"
        required
        value={input}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage(input);
            setInput("");
          }
        }}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />
    </Box>
    <Button
      textTransform={"uppercase"}
      bg="brand.mainGray"
      color="white"
      _hover={{
        bg: "brand.light",
      }}
      _active={{
        bg: "brand.dark",
      }}
      type="submit"
      onClick={() => {
        sendMessage(input);
        setInput("");
      }}
    >
      Enviar
    </Button>
  </HStack>
);

export default InputMessage;
