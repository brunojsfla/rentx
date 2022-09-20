import { useNavigation } from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { useAuth } from "../../hooks/auth";
import { useTheme } from "styled-components";
import { BackButton } from "../../components/BackButton";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Yup from "yup";

import {
  Container,
  Header,
  HeaderTop,
  HeaderTitle,
  LogoutButton,
  PhotoContainer,
  Photo,
  PhotoButton,
  Content,
  Options,
  Option,
  OptionTitle,
  Section,
} from "./styles";

import { Input } from "../../components/Input";
import { PasswordInput } from "../../components/PasswordInput";
import { Button } from "../../components/Button";
import { useNetInfo } from "@react-native-community/netinfo";

export function Profile() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { user, signOut, updateUser } = useAuth();
  const [option, setOption] = useState<"dataEdit" | "passwordEdit">("dataEdit");
  const [avatar, setAvatar] = useState(user.avatar);
  const [name, setName] = useState(user.name);
  const [driverLicense, setDriverLicense] = useState(user.driver_license);
  const netInfo = useNetInfo();

  function handleGoBack() {
    navigation.goBack();
  }

  function handleChageData() {
    setOption("dataEdit");
  }

  function handleChangePassword() {
    if (!netInfo.isConnected) {
      Alert.alert(
        "Opa! Você está offline!",
        "Para alterar sua senha, esteja conectado à internet!"
      );
      return;
    }
    setOption("passwordEdit");
  }

  async function handleSignOut() {
    Alert.alert(
      "Confirmar",
      "Realmente deseja encerrar sua seção? Para reconectar, você precisará estar conectado à internet!",
      [
        {
          text: "SIM",
          onPress: () => {
            signOut();
          },
        },
        {
          text: "NÃO",
          onPress: () => {
            return;
          },
        },
      ]
    );
  }

  async function handleSelectAvatar() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (result.cancelled) {
      return;
    }

    if (result.uri) {
      setAvatar(result.uri);
    }
  }

  async function handleProfileUpdate() {
    try {
      const schema = Yup.object().shape({
        driverLicense: Yup.string().required("CNH é obrigatória!"),
        name: Yup.string().required("Nome é obrigatório!"),
      });

      const data = { name, driverLicense };

      await schema.validate(data);
      await updateUser({
        id: user.id,
        user_id: user.user_id,
        email: user.email,
        name,
        driver_license: driverLicense,
        avatar,
        token: user.token,
      });

      Alert.alert("Perfil alterado com sucesso!");
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        Alert.alert("Opa...", error.message);
      } else {
      }
      console.log("Erro ao salvar alterações do perfil: ", error);
      Alert.alert(
        "Opa...",
        "Não foi possível salvar as alterações! Por favor, tente novamente mais tarde."
      );
    }
  }

  return (
    <KeyboardAvoidingView behavior="position" enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Header>
            <HeaderTop>
              <BackButton color={theme.colors.shape} onPress={handleGoBack} />
              <HeaderTitle>Editar Perfil</HeaderTitle>
              <LogoutButton onPress={handleSignOut}>
                <Feather name="power" size={24} color={theme.colors.shape} />
              </LogoutButton>
            </HeaderTop>
            <PhotoContainer>
              {!!avatar && (
                <Photo
                  source={{
                    uri: avatar,
                  }}
                />
              )}
              <PhotoButton onPress={handleSelectAvatar}>
                <Feather name="camera" size={24} color={theme.colors.shape} />
              </PhotoButton>
            </PhotoContainer>
          </Header>

          <Content style={{ marginBottom: useBottomTabBarHeight() }}>
            <Options>
              <Option onPress={handleChageData} active={option === "dataEdit"}>
                <OptionTitle active={option === "dataEdit"}>Dados</OptionTitle>
              </Option>
              <Option
                onPress={handleChangePassword}
                active={option === "passwordEdit"}
              >
                <OptionTitle active={option === "passwordEdit"}>
                  Trocar senha
                </OptionTitle>
              </Option>
            </Options>

            {option === "dataEdit" && (
              <Section>
                <Input
                  iconName="user"
                  placeholder="Nome"
                  autoCorrect={false}
                  defaultValue={user.name}
                  value={name}
                  onChangeText={setName}
                />
                <Input
                  iconName="mail"
                  editable={false}
                  defaultValue={user.email}
                />
                <Input
                  iconName="credit-card"
                  placeholder="CNH"
                  keyboardType="numeric"
                  defaultValue={user.driver_license}
                  value={driverLicense}
                  onChangeText={setDriverLicense}
                />
              </Section>
            )}
            {option === "passwordEdit" && (
              <Section>
                <PasswordInput iconName="lock" placeholder="Senha atual" />
                <PasswordInput iconName="lock" placeholder="Nova senha" />
                <PasswordInput iconName="lock" placeholder="Repetir senha" />
              </Section>
            )}
            <Button title="Salvar alterações" onPress={handleProfileUpdate} />
          </Content>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
