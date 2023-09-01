import { Button, Input, HStack, Box } from "@chakra-ui/react";

const InputMessage = ({
  input,
  setInput,
  sendMessage,
}: {
  input: string;
  setInput: (msg: string) => void;
  sendMessage: (msg: string) => void;
}) => {
  return (
    <HStack spacing={4} px={6} w={"full"}>
      <Box flex="1">
        <Input
          size="md"
          _hover={{
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "brand.primaryLight",
            boxShadow: "0px 3px 10px 0px #0000001a",
          }}
          _focus={{
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "brand.primaryLight",
            boxShadow: "0px 3px 10px 0px #0000001a",
          }}
          placeholder="Envie sua pergunta ou dúvida e a aIAna vai te ajudar"
          _placeholder={{
            opacity: 1,
            color: "placeholder",
          }}
          borderRadius="md"
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
        type="submit"
        onClick={() => {
          sendMessage(input);
          setInput("");
        }}
        isDisabled={input === ""}
      >
        Enviar
      </Button>
    </HStack>
  );
};

export default InputMessage;
