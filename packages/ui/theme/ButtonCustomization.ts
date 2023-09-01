import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const variant = defineStyle((props) => ({
  textTransform: "uppercase",
  color: "white",
  bg: `button.${props.variant}.default`,
  _hover: {
    bg: `button.${props.variant}.light`,
  },
  _active: {
    bg: `button.${props.variant}.dark`,
  },
  _focus: {
    bg: `button.${props.variant}.dark`,
  },
  _disabled: {
    bg: "brand.primaryGray !important",
    _hover: {
      bg: "brand.darkGray !important",
    },
    _active: {
      bg: "brand.darkGray !important",
    },
    _focus: {
      bg: "brand.darkGray !important",
    },
  },
}));

const optionVariant = defineStyle({
  border: "1px solid",
  borderColor: "button.option.default",
  borderRadius: "md",
  color: "brand.darkGray",
  bg: "white",
  fontWeight: "normal",
  _hover: {
    bg: "button.option.hover",
  },
  _focus: {
    bg: "button.option.active",
  },
});

const outlineVariant = defineStyle({
  background: "white",
  color: "brand.primary",
  border: "1px solid",
  borderColor: "button.primary.default",
  _hover: {
    borderColor: "button.primary.hover",
  },
  _active: {
    borderColor: "button.primary.active",
  },
  _focus: {
    borderColor: "button.primary.active",
  },
});

const Button = defineStyleConfig({
  variants: {
    primary: variant,
    secondary: variant,
    outline: outlineVariant,
    option: optionVariant,
  },
  defaultProps: {
    size: "md",
    variant: "primary",
  },
});

export default Button;
