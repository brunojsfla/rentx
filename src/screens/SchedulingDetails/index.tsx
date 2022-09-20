import React, { useState } from "react";
import { useTheme } from "styled-components";

import { BackButton } from "../../components/BackButton";
import { ImageSlider } from "../../components/ImageSlider";
import { Accessory } from "../../components/Accessory";
import { Button } from "../../components/Button";

import { Feather } from "@expo/vector-icons";
import { eachDayOfInterval, format } from "date-fns";

import {
  Container,
  Header,
  CarImages,
  Content,
  Details,
  Description,
  Brand,
  Name,
  Rent,
  Period,
  Price,
  Acessories,
  Footer,
  RentalPeriod,
  CalendarIcon,
  DateInfo,
  DateTitle,
  DateValue,
  RentalPrice,
  RentalPriceLabel,
  RentalPriceDetails,
  RentalPriceQuota,
  RentalPriceTotal,
} from "./styles";
import { RFValue } from "react-native-responsive-fontsize";
import { useNavigation, useRoute } from "@react-navigation/native";
import { CarType } from "../../types";
import { getIconByType } from "../../utils/getIconByType";
import api from "../../services/api";
import { Alert } from "react-native";
import { getPlatformDate } from "../../utils/getPlatformDate";

interface RentalPeriod {
  start: number;
  startFormatted: string;
  end: number;
  endFormatted: string;
}

interface Params {
  car: CarType;
  dates: RentalPeriod;
}

export function SchedulingDetails() {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { car, dates } = route.params as Params;
  const [loading, setLoading] = useState(false);

  const numberDays = eachDayOfInterval({
    start: getPlatformDate(new Date(dates.start)),
    end: getPlatformDate(new Date(dates.end)),
  });

  async function handleSuccess() {
    setLoading(true);
    const schedulesByCar = await api.get(`/schedules_bycars/${car.id}`);
    const intervalDateFormatted = numberDays.map((item) =>
      format(item, "yyyy-MM-dd")
    );

    const unavailable_dates = [
      ...schedulesByCar.data.unavailable_dates,
      ...intervalDateFormatted,
    ];

    await api.post("/schedules_byuser", {
      user_id: 2,
      car,
      startDate: format(getPlatformDate(new Date(dates.start)), "dd/MM/yyy"),
      endDate: format(getPlatformDate(new Date(dates.end)), "dd/MM/yyyy"),
    });

    api
      .put(`/schedules_bycars/${car.id}`, {
        id: car.id,
        unavailable_dates,
      })
      .then(() =>
        navigation.navigate("Confirmation", {
          title: "Carro alugado!",
          message:
            "Agora você só precisa ir\n até a concessionária da RENTX\n pegar o seu automóvel.",
          nextScreenRoute: "Home",
        })
      )
      .catch(() =>
        Alert.alert(
          "Falha ao confirmar o agendamento. Por favor, tente novamente mais tarde!"
        )
      )
      .finally(() => setLoading(false));
  }

  function handleGoBack() {
    navigation.goBack();
  }

  return (
    <Container>
      <Header>
        <BackButton onPress={handleGoBack} />
      </Header>
      <CarImages>
        <ImageSlider imagesUrl={car.photos} />
      </CarImages>

      <Content>
        <Details>
          <Description>
            <Brand>{car.brand}</Brand>
            <Name>{car.name}</Name>
          </Description>

          <Rent>
            <Period>{car.period}</Period>
            <Price>R$ {car.price}</Price>
          </Rent>
        </Details>

        <Acessories>
          {car.accessories.map((item, index) => (
            <Accessory
              name={item.name}
              icon={getIconByType(item.type)}
              key={index}
            />
          ))}
        </Acessories>

        <RentalPeriod>
          <CalendarIcon>
            <Feather
              name="calendar"
              size={RFValue(24)}
              color={theme.colors.shape}
            />
          </CalendarIcon>
          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValue>{dates.startFormatted}</DateValue>
          </DateInfo>

          <Feather
            name="chevron-right"
            size={RFValue(10)}
            color={theme.colors.text_detail}
          />

          <DateInfo>
            <DateTitle>ATÉ</DateTitle>
            <DateValue>{dates.endFormatted}</DateValue>
          </DateInfo>
        </RentalPeriod>

        <RentalPrice>
          <RentalPriceLabel>Total</RentalPriceLabel>
          <RentalPriceDetails>
            <RentalPriceQuota>
              R$ {car.price} x {numberDays.length}
            </RentalPriceQuota>
            <RentalPriceTotal>
              R$ {Number(car.price * numberDays.length).toFixed(2)}
            </RentalPriceTotal>
          </RentalPriceDetails>
        </RentalPrice>
      </Content>

      <Footer>
        <Button
          title="Alugar agora"
          color={theme.colors.success}
          onPress={handleSuccess}
          loading={loading}
          enabled={!loading}
        />
      </Footer>
    </Container>
  );
}
