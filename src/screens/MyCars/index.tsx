import React, { useEffect, useState } from "react";

import {
  Container,
  Header,
  Title,
  Subtitle,
  CarList,
  Content,
  Appointments,
  AppointmentsTitle,
  AppointmentsQuantity,
  CarWrapper,
  CarFooter,
  CarFooterTitle,
  CarFooterPeriod,
  CarFooterDate,
} from "./styles";

import { CarType } from "../../types";
import api from "../../services/api";
import { ActivityIndicator, StatusBar } from "react-native";

import { useTheme } from "styled-components";
import { useNavigation } from "@react-navigation/native";
import { BackButton } from "../../components/BackButton";
import { Car } from "../../components/Car";
import { AntDesign } from "@expo/vector-icons";

interface CarProps {
  id: string;
  user_id: string;
  car: CarType;
  startDate: string;
  endDate: string;
}

export function MyCars() {
  const [cars, setCars] = useState<CarProps[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack();
  }

  useEffect(() => {
    async function fetchCars() {
      try {
        const response = await api.get("/schedules_byuser?user_id=2");
        console.log(response.data);
        setCars(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    fetchCars();
  }, []);

  return (
    <Container>
      <Header>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        <BackButton onPress={handleGoBack} color={theme.colors.shape} />
        <Title>{`Seus agendamentos \nestão aqui`}</Title>
        <Subtitle>Conforto, segurança e praticidade</Subtitle>
      </Header>
      {loading && (
        <ActivityIndicator
          size={"large"}
          color={theme.colors.main}
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        />
      )}
      {!loading && (
        <Content>
          <Appointments>
            <AppointmentsTitle>Agendamentos realizados</AppointmentsTitle>
            <AppointmentsQuantity>{cars.length}</AppointmentsQuantity>
          </Appointments>

          <CarList
            data={cars}
            renderItem={({ item }) => (
              <CarWrapper>
                <Car data={item.car} />
                <CarFooter>
                  <CarFooterTitle>Período</CarFooterTitle>
                  <CarFooterPeriod>
                    <CarFooterDate>{item.startDate}</CarFooterDate>
                    <AntDesign
                      name="arrowright"
                      size={20}
                      color={theme.colors.title}
                      style={{ marginHorizontal: 10 }}
                    />
                    <CarFooterDate>{item.endDate}</CarFooterDate>
                  </CarFooterPeriod>
                </CarFooter>
              </CarWrapper>
            )}
            keyExtractor={(item) => item.id}
          />
        </Content>
      )}
    </Container>
  );
}
