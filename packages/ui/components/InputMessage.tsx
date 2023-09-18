import {
  Button,
  Input,
  Box,
  IconButton,
  InputGroup,
  InputRightElement,
  useMediaQuery,
  Textarea,
  forwardRef
} from "@chakra-ui/react";
import ResizeTextarea from "react-textarea-autosize";
import { SearchIcon } from "@chakra-ui/icons";

import SendMessageIcon from "./SendMessageIcon";

export const AutoResizeTextarea = forwardRef((props, ref) => (
  <Textarea
    minH="unset"
    overflow="hidden"
    w="100%"
    resize="none"
    ref={ref}
    minRows={3}
    as={ResizeTextarea}
    {...props}
  />
));

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
    ? "Envie sua pergunta ou dúvida e a IAna vai te ajudar"
    : "Envie sua pergunta ou dúvida";

  return (
    <Box px={6} w={"full"}>
      <InputGroup gap={{ base: 0, md: 4 }}>
        <Input
          display={{ base: "none", md: "initial" }}
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

        <AutoResizeTextarea
          display={{ base:"initial", md: "none" }}
          maxRows={3}
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
          aria-label="Campo de envio de mensagem"
          required
          value={input}
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
              sendMessage(input);
              setInput("");
            }
          }}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setInput(event.target.value);
          }}

          variant="outline"
          size="xs"
          minRows={1}
          pr={35}
        />
        <InputRightElement
          display={{ base: "flex", md: "none" }}
          p="5px"
          h="100%"
          
        >
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
