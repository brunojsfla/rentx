import React, { useState } from "react";
import { TextInputProps } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "styled-components";

import { Container, InputText, IconContainer } from "./styles";

interface Props extends TextInputProps {
  iconName: React.ComponentProps<typeof Feather>["name"];
  value?: string;
}

export function Input({ iconName, value, ...rest }: Props) {
  const theme = useTheme();
  const [isFocoused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  function handleInputFocus() {
    setIsFocused(true);
  }

  function handleInputBlur() {
    setIsFocused(false);
    setIsFilled(!!value);
  }

  return (
    <Container>
      <IconContainer isFocused={isFocoused}>
        <Feather
          name={iconName}
          size={24}
          color={
            isFocoused || isFilled
              ? theme.colors.main
              : theme.colors.text_detail
          }
        />
      </IconContainer>
      <InputText
        {...rest}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        isFocused={isFocoused}
      />
    </Container>
  );
}
