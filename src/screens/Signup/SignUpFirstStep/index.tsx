import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { BackButton } from "../../../components/BackButton";
import { Bullet } from "../../../components/Bullet";
import { Input } from "../../../components/Input";
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

import * as Yup from "yup";

export function SignUpFirstStep() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cnh, setCnh] = useState("");

  function handleBackToSignIn() {
    navigation.goBack();
  }

  async function handleSecondStep() {
    try {
      const schema = Yup.object().shape({
        cnh: Yup.string().required("CNH obrigatória!"),
        email: Yup.string()
          .required("E-mail obrigatório!")
          .email("Informe um e-mail válido!"),
        name: Yup.string().required("Nome obrigatório"),
      });

      const data = { name, email, cnh };
      await schema.validate(data);

      navigation.navigate("SignUpSecondStep", { user: data });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        Alert.alert("Opa...", error.message);
      } else {
        Alert.alert(
          "Opa...",
          "Desculpe, um erro ocorreu. Tente novamente mais tarde!"
        );
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
              <Bullet active />
              <Bullet />
            </Steps>
          </Header>
          <Title>Crie sua {"\n"}conta</Title>
          <SubTitle>Faça seu cadastro de {"\n"}forma rápida e fácil</SubTitle>
          <Form>
            <FormTitle>1. Dados</FormTitle>
            <Input
              iconName="user"
              placeholder="Nome"
              onChangeText={setName}
              value={name}
            />
            <Input
              iconName="mail"
              placeholder="E-mail"
              keyboardType="email-address"
              onChangeText={setEmail}
              value={email}
            />
            <Input
              iconName="credit-card"
              placeholder="CNH"
              keyboardType="numeric"
              onChangeText={setCnh}
              value={cnh}
            />
          </Form>
          <Button title="Próximo" onPress={handleSecondStep} />
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
