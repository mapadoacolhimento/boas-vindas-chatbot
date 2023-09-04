import {
  Button,
  Input,
  Box,
  IconButton,
  InputGroup,
  InputRightElement,
  useMediaQuery,
} from "@chakra-ui/react";
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
  const [isLargerThanMd] = useMediaQuery("(min-width: 768px)");
  const placeholder = isLargerThanMd
    ? "Envie sua pergunta ou dúvida e a aIAna vai te ajudar"
    : "Envie sua pergunta ou dúvida";

  return (
    <Box px={6} w={"full"}>
      <InputGroup gap={{ base: 0, md: 4 }}>
        <Input
          _hover={{
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "brand.primaryMedium",
            boxShadow: "0px 3px 10px 0px #0000001a",
          }}
          _focus={{
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "brand.primaryMedium",
            boxShadow: "0px 3px 10px 0px #0000001a",
          }}
          placeholder={placeholder}
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
          aria-label="Campo de envio de mensagem"
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

        <InputRightElement display={{ base: "flex", md: "none" }}>
          <IconButton
            size={"xs"}
            color={"white"}
            icon={<SendMessageIcon boxSize={4} />}
            aria-label="Enviar mensagem"
            type="submit"
            onClick={() => {
              sendMessage(input);
              setInput("");
            }}
            isDisabled={input === ""}
            _disabled={{
              bgColor: "transparent",
              color: "brand.primaryGray",
            }}
          />
        </InputRightElement>

        <Button
          display={{ base: "none", md: "initial" }}
          type="submit"
          onClick={() => {
            sendMessage(input);
            setInput("");
          }}
          isDisabled={input === ""}
          minW={"90px"}
        >
          Enviar
        </Button>
      </InputGroup>
    </Box>
  );
};

export default InputMessage;
