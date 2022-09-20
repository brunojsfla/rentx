import React, { useState } from "react";
import api from "../../../services/api";
import { useNavigation, useRoute } from "@react-navigation/native";
import { BackButton } from "../../../components/BackButton";
import { Bullet } from "../../../components/Bullet";
import { PasswordInput } from "../../../components/PasswordInput";
import { Button } from "../../../components/Button";

import {
  Container,
  Header,
  Steps,
  Title,
  SubTitle,
  Form,
  FormTitle,
} from "./styles";
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  Alert,
} from "react-native";
import { useTheme } from "styled-components";
import * as Yup from "yup";

interface UserParams {
  user: {
    name: string;
    email: string;
    cnh: string;
  };
}

export function SignUpSecondStep() {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const navigation = useNavigation();
  const theme = useTheme();
  const route = useRoute();
  const { user } = route.params as UserParams;

  function handleBackToSignIn() {
    navigation.goBack();
  }

  async function handleRegister() {
    try {
      const schema = Yup.object().shape({
        passwordConfirmation: Yup.string()
          .required("Confirmação de senha não informada")
          .oneOf([Yup.ref("password"), null], "As senhas não conferem!"),
        password: Yup.string().required("Senha não informada!"),
      });

      await schema.validate({ password, passwordConfirmation });
      await api
        .post("/users", {
          name: user.name,
          email: user.email,
          password,
          driver_license: user.cnh,
        })
        .then(() => {
          navigation.navigate("Confirmation", {
            title: "Conta criada!",
            message: "Agora é só fazer login\n e aproveitar.",
            nextScreenRoute: "Signin",
          });
        })
        .catch((error) => {
          console.log(error);
          Alert.alert("Opa...", "Não foi possível cadastrar!");
        });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        Alert.alert("Opa...", error.message);
      }
    }
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
            <BackButton onPress={handleBackToSignIn} />
            <Steps>
              <Bullet />
              <Bullet active />
            </Steps>
          </Header>
          <Title>Crie sua {"\n"}conta</Title>
          <SubTitle>Faça seu cadastro de {"\n"}forma rápida e fácil</SubTitle>
          <Form>
            <FormTitle>2. Senha</FormTitle>
            <PasswordInput
              iconName="lock"
              placeholder="Senha"
              onChangeText={setPassword}
              value={password}
            />
            <PasswordInput
              iconName="lock"
              placeholder="Repetir Senha"
              onChangeText={setPasswordConfirmation}
              value={passwordConfirmation}
            />
          </Form>
          <Button
            title="Cadastrar"
            color={theme.colors.success}
            onPress={handleRegister}
          />
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
