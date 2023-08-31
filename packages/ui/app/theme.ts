import { extendTheme } from "@chakra-ui/react";
import { Fugaz_One, Nunito_Sans } from "next/font/google";

const nunito = Nunito_Sans({ subsets: ["latin"], weight: ["400", "700"]});
const fugazOne = Fugaz_One({subsets: ["latin"], weight: ["400"]})

const theme = extendTheme({
  fonts: {
    heading: nunito.style.fontFamily,
    body: nunito.style.fontFamily,
    fugazOne: fugazOne.style.fontFamily
  },
  colors: {
    brand: {
      light: "#732E76",
      mediumPurple: "#C68CB9",
      default: "#622565",
      dark: "#57215A",
      lightGray: "#EFEFEF",
      mainGray: "#AAAAAA",
      darkGray: "#565656",
    },   
  }
});

export default theme;
