import { extendTheme } from "@chakra-ui/react";
import { Nunito_Sans } from "next/font/google";

const nunito = Nunito_Sans({ subsets: ["latin"], weight: ["400", "700"]});

const theme = extendTheme({
  fonts: {
    heading: nunito.style.fontFamily,
    body: nunito.style.fontFamily,
  },
  colors: {
    purple: {
      light: "#732E76",
      default: "#622565",
      dark: "#57215A"
      
    },
      
  }
});

export default theme;
