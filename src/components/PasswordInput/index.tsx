import React, { useState } from "react";
import { TextInputProps } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "styled-components";
import { BorderlessButton } from "react-native-gesture-handler";

import { Container, InputText, IconContainer } from "./styles";

interface Props extends TextInputProps {
  iconName: React.ComponentProps<typeof Feather>["name"];
  value?: string;
}

export function PasswordInput({ iconName, value, ...rest }: Props) {
  const theme = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);
  const [isFocoused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  function handlePasswordVisibilityChange() {
    setIsPasswordVisible((prevState) => !prevState);
  }

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
        secureTextEntry={isPasswordVisible}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        isFocused={isFocoused}
      />
      <BorderlessButton onPress={handlePasswordVisibilityChange}>
        <IconContainer isFocused={isFocoused}>
          <Feather
            name={isPasswordVisible ? "eye" : "eye-off"}
            se
            size={24}
            color={theme.colors.text_detail}
          />
        </IconContainer>
      </BorderlessButton>
    </Container>
  );
}
