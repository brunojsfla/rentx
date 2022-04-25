import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StatusBar, ActivityIndicator } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

import Logo from "../../assets/logo.svg";
import { Ionicons } from "@expo/vector-icons";

import {
  Container,
  Header,
  TotalCars,
  HeaderContent,
  CarList,
  ContainerLoading,
  MyCarsButton,
} from "./styles";

import { Car } from "../../components/Car";

import api from "../../services/api";

import { CarType } from "../../types";

import { useTheme } from "styled-components";

export function Home() {
  const navigation = useNavigation();
  const [cars, setCars] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    async function findCars() {
      try {
        const response = await api.get("/cars");

        setCars(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    findCars();
  }, []);

  function handleCarDetails(car: CarType) {
    navigation.navigate("CarDetails", { car });
  }

  function handleOpenMyCars() {
    navigation.navigate("MyCars");
  }


  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <Header>
        <HeaderContent>
          <Logo width={RFValue(108)} height={RFValue(12)} />
          <TotalCars>Total de {cars.length} carros</TotalCars>
        </HeaderContent>
      </Header>
      {loading && (
        <ContainerLoading>
          <ActivityIndicator size={"large"} color="red" />
        </ContainerLoading>
      )}
      {!loading && (
        <CarList
          data={cars}
          renderItem={({ item }) => (
            <Car data={item} onPress={() => handleCarDetails(item)} />
          )}
          keyExtractor={(item) => item.id}
        />
      )}

      <MyCarsButton onPress={handleOpenMyCars}>
        <Ionicons name="ios-car-sport" size={32} color={theme.colors.shape} />
      </MyCarsButton>
    </Container>
  );
}
