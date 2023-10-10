import { Box, Stack, Button, Text } from "@chakra-ui/react";

const getSuggestions = (city: string | null) => {
  const suggestions = [
    {
      text: "Tipos de serviço público",
      query:
        "Quais são os tipos de serviços públicos disponíveis para mulheres vítimas de violência?",
    },
    {
      text: "Mapa de serviços públicos",
      query:
        "Qual a URL para acessar o mapa de serviços públicos do Mapa do Acolhimento?",
    },
    {
      text: "Como fazer para encaminhar?",
      query:
        "Como encaminhar a mulher em situação de risco para a rede de serviços públicos?",
    },
    {
      text: "Como denunciar?",
      query:
        "Como ajudar a mulher em situação de risco a fazer uma denúncia de violência de gênero?",
    },
    {
      text: "Como fazer a articulação?",
      query:
        "Como fazer a articulação com os serviços públicos para os atendimentos?",
    },
  ];

  if (city) {
    suggestions.push({
      text: "Serviços públicos do meu município",
      query: `Quais são os endereços dos serviços públicos de atendimento a mulher vítima de violência no município de ${city}?`,
    });
  }

  return suggestions;
};

const ChatSuggestions = ({
  handleClick,
  city,
}: {
  handleClick: (query: string) => void;
  city: string | null;
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
      {getSuggestions(city).map(({ text, query }, index) => (
        <Button
          key={index}
          variant={"option"}
          size={"sm"}
          fontWeight="400"
          onClick={() => handleClick(query)}
        >
          {text}
        </Button>
      ))}
    </Stack>
  </Box>
);

export default ChatSuggestions;
