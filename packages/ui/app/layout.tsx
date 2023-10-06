import { Providers } from "./providers";

export const metadata = {
  title: "IAna - Chatbot do Mapa do Acolhimento",
  // description:
  //   "Assistente virtual (IAna) criada pelo Mapa do Acolhimento para auxiliar na capacitação das voluntárias",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
