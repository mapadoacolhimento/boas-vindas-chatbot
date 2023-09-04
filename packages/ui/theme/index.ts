import { extendTheme } from "@chakra-ui/react";
import { Fugaz_One, Nunito_Sans } from "next/font/google";
import ButtonCustomization from "./ButtonCustomization";

const nunito = Nunito_Sans({ subsets: ["latin"], weight: ["400", "700"] });
const fugazOne = Fugaz_One({ subsets: ["latin"], weight: ["400"] });

const theme = extendTheme({
  components: {
    Button: ButtonCustomization,
  },
  fonts: {
    heading: nunito.style.fontFamily,
    body: nunito.style.fontFamily,
    fugazOne: fugazOne.style.fontFamily,
  },
  semanticTokens: {
    colors: {
      chatBackground: "rgba(255, 219, 219, 0.22)",
      text: "#424242",
      placeholder: "#AAA",
      button: {
        primary: {
          default: "#622565",
          hover: "#732E76",
          active: "#57215A",
        },
        secondary: {
          default: "#E8B638",
          hover: "#F6C54A",
          active: "#DAA92F",
        },
        option: {
          default: "#E0E0E0",
          hover: "#EEE",
          active: "#EEE",
        },
      },
      brand: {
        primary: "#622565",
        primaryLight: "#732E76",
        mediumPurple: "#C68CB9",
        primaryDark: "#57215A",
        secondary: "#E8B638",
        primaryGray: "#AAAAAA",
        lightGray: "#EFEFEF",
        darkGray: "#565656",
      },
    },
  },
});

export default theme;
