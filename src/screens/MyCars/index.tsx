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

import { Car as ModelCar } from "../../database/model/Car";
import api from "../../services/api";
import { ActivityIndicator, StatusBar } from "react-native";

import { useTheme } from "styled-components";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { BackButton } from "../../components/BackButton";
import { Car } from "../../components/Car";
import { AntDesign } from "@expo/vector-icons";
import { format, parseISO } from "date-fns";

interface DataProps {
  id: string;
  car: ModelCar;
  start_date: string;
  end_date: string;
}

export function MyCars() {
  const [cars, setCars] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const navigation = useNavigation();
  const screenIsfocus = useIsFocused();

  function handleGoBack() {
    navigation.goBack();
  }

  useEffect(() => {
    async function fetchCars() {
      try {
        const response = await api.get("/rentals");
        const dataFormatted = response.data.map((data: DataProps) => {
          return {
            id: data.id,
            car: data.car,
            start_date: format(parseISO(data.start_date), "dd/MM/yyyy"),
            end_date: format(parseISO(data.end_date), "dd/MM/yyyy"),
          };
        });
        setCars(dataFormatted);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    fetchCars();
  }, [screenIsfocus]);

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
                    <CarFooterDate>{item.start_date}</CarFooterDate>
                    <AntDesign
                      name="arrowright"
                      size={20}
                      color={theme.colors.title}
                      style={{ marginHorizontal: 10 }}
                    />
                    <CarFooterDate>{item.end_date}</CarFooterDate>
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
