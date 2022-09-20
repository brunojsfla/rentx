import React, { useEffect, useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useNetInfo } from "@react-native-community/netinfo";
import { synchronize } from "@nozbe/watermelondb/sync";
import { database } from "../../database";

import Logo from "../../assets/logo.svg";
import LottieView from "lottie-react-native";

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
import { Car as ModelCar } from "../../database/model/Car";

export function Home() {
  const animation = useRef(null);
  const navigation = useNavigation();
  const netInfo = useNetInfo();
  const [cars, setCars] = useState<ModelCar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function findCars() {
      try {
        const carCollection = database.get<ModelCar>("cars");
        const cars = await carCollection.query().fetch();
        if (isMounted) {
          setCars(cars);
        }
      } catch (error) {
        console.log(error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    findCars();
    return () => {
      isMounted = false;
    };
  }, []);

  function handleCarDetails(car: CarType) {
    navigation.navigate("CarDetails", { car });
  }

  async function offlineSynchronize() {
    await synchronize({
      database,
      pullChanges: async ({ lastPulledAt }) => {
        const response = await api.get(
          `cars/sync/pull?lastPulledVersion=${lastPulledAt || 0}`
        );

        const { changes, latestVersion } = response.data;

        return { changes, timestamp: latestVersion };
      },
      pushChanges: async ({ changes }) => {
        const user = changes.users;
        await api.post("/users/sync", user);
      },
    });
  }

  useEffect(() => {
    if (netInfo.isConnected) offlineSynchronize();
  }, [netInfo.isConnected]);

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
          {!loading && <TotalCars>Total de {cars.length} carros</TotalCars>}
        </HeaderContent>
      </Header>
      {loading && (
        <ContainerLoading>
          <LottieView
            autoPlay
            loop
            ref={animation}
            style={{ width: 400, height: 400 }}
            source={require("../../assets/load_animation.json")}
          />
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
