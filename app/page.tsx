import { Text, Page } from "@vercel/examples-ui";
import { Chat } from "../components/Chat";

function Home() {
  return (
    <Page className="flex flex-col gap-12 justify-center bg-white">
      <section className="flex flex-col gap-6 pt-6 text-center text-xl pb-8 shadow-lg text-violet-500 font-bold">
        <Text variant="h1">Chat Mapa do Acolhimento</Text>
        <Text className="text-justify px-8 font-light font-sans bg-white text-zinc-400	">
          Esse é um exemplo de chat bot simples que foi implementado usando rotas Next.js, API, e OpenAI API.
        </Text>
      </section>
      <section className="flex flex-col gap-3 text-black px-8 pb-8">
        <Text variant="h2">IAna:</Text>
        <div className="lg:w-2/3">
          <Chat />
        </div>
      </section>
    </Page>
  );
}

export default Home;
