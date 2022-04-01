import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StatusBar, ActivityIndicator } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

import Logo from "../../assets/logo.svg";

import {
  Container,
  Header,
  TotalCars,
  HeaderContent,
  CarList,
  ContainerLoading,
} from "./styles";

import { Car } from "../../components/Car";

import api from "../../services/api";

import { CarType } from "../../types";

export function Home() {
  const navigation = useNavigation();
  const [cars, setCars] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);

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
    </Container>
  );
}
