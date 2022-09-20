import React, { useState } from "react";
import {
  StatusBar,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import * as Yup from "yup";

import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { PasswordInput } from "../../components/PasswordInput";
import theme from "../../styles/theme";
import { useAuth } from "../../hooks/auth";

import { Container, Header, Title, SubTitle, Footer, Form } from "./styles";

export function Signin() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useAuth();

  async function handleSignIn() {
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .required("E-mail obrigatório!")
          .email("Informe um e-mail válido!"),
        password: Yup.string().required("Senha obrigatória!"),
      });

      await schema.validate({ email, password });
      signIn({ email, password });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        Alert.alert("Opa...", error.message);
      } else {
        Alert.alert(
          "Falha ao autenticar",
          "Verifique suas credenciais e tente novamente!"
        );
      }
    }
  }

  function handleNewAccount() {
    navigation.navigate("SignUpFirstStep");
  }

  return (
    <KeyboardAvoidingView behavior="position" enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <StatusBar
            barStyle={"dark-content"}
            backgroundColor="transparent"
            translucent
          />
          <Header>
            <Title>Estamos{"\n"}quase lá.</Title>
            <SubTitle>
              Faça seu login para começar{"\n"}uma experiência incrível.
            </SubTitle>
          </Header>

          <Form>
            <Input
              iconName="mail"
              placeholder="E-mail"
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={setEmail}
              value={email}
            />
            <PasswordInput
              iconName="lock"
              placeholder="Senha"
              onChangeText={setPassword}
              value={password}
            />
          </Form>

          <Footer>
            <Button
              title="Login"
              enabled
              loading={false}
              onPress={handleSignIn}
            />
            <Button
              title="Criar conta gratuita"
              color={theme.colors.background_secondary}
              onPress={handleNewAccount}
              enabled
              loading={false}
              light
            />
          </Footer>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
