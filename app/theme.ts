import { extendTheme } from "@chakra-ui/react"
import "@fontsource/nunito"

const theme = extendTheme({
  fonts: {
    heading: `'Nunito', sans-serif`,
    body: `'Nunito', sans-serif`,
  },
})

export default theme