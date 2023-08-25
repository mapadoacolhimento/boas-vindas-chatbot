import { extendTheme } from "@chakra-ui/react";
import { Nunito_Sans } from "next/font/google";

const nunito = Nunito_Sans({ subsets: ["latin"], weight: ["400", "700"]});

const theme = extendTheme({
  fonts: {
    heading: nunito.style.fontFamily,
    body: nunito.style.fontFamily,
  },
  colorsPurple: {
    lightPurple: "#732E76",
    purple: "#622565",
    darkPurple: "#57215A"
    },
});

export default theme;
