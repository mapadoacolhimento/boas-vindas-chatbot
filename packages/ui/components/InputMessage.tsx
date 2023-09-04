import { Button, Input, HStack, Box, InputGroup, InputRightElement } from "@chakra-ui/react";
import SendMessageIcon from "./SendMessageIcon";

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
    <>
      <HStack 
        spacing={4} 
        px={6} 
        w={"full"}
        display={{ base: "none", md: "flex" }}
      >
        <Box 
          flex="1"
        >
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
              size: "md",
              fontsize: "13px",
              fontWeight: "400",
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
      <HStack
        display={{base: "flex", md: "none"}}
        spacing={4} px={6} w={"full"}
      >
        <InputGroup size='md'>
          <Input
            type={'text'}
            aria-label="input chat"
            placeholder="Envie sua pergunta ou dúvida"
            _placeholder={{
              opacity: 1,
              color: "placeholder",
              size: "md",
              fontsize: "13px",
              fontWeight: "400",
            }}
            borderRadius="7px"
            border="1px solid"
            borderColor="brand.lightGray"
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
          />
          <InputRightElement
            px={"16px"}
            py={"16px"}
          >
            <Button
              size="lg"
              bg="transparent"
            >
              <SendMessageIcon />
            </Button>
          </InputRightElement>
        </InputGroup>
      </HStack>
    </>
  ); 
};

export default InputMessage;
