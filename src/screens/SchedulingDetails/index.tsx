import React, { useState, useEffect } from "react";
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
import { useNetInfo } from "@react-native-community/netinfo";

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
  const [carUpdated, setCarUpdated] = useState<CarType>({} as CarType);
  const netInfo = useNetInfo();

  const numberDays = eachDayOfInterval({
    start: getPlatformDate(new Date(dates.start)),
    end: getPlatformDate(new Date(dates.end)),
  });

  async function handleSuccess() {
    setLoading(true);

    await api
      .post("/rentals", {
        user_id: 1,
        car_id: car.id,
        start_date: new Date(dates.start),
        end_date: new Date(dates.end),
        total: Number(car.price * numberDays.length),
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

  useEffect(() => {
    async function fetchCarUpdated() {
      const response = await api.get(`/cars/${car.id}`);

      setCarUpdated(response.data);
    }

    if (netInfo.isConnected) fetchCarUpdated();
  }, [netInfo.isConnected]);

  return (
    <Container>
      <Header>
        <BackButton onPress={handleGoBack} />
      </Header>
      <CarImages>
        <ImageSlider
          imagesUrl={
            !!carUpdated.photos
              ? carUpdated.photos
              : [{ id: car.id, photo: car.thumbnail }]
          }
        />
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

        {carUpdated.accessories && (
          <Acessories>
            {carUpdated.accessories.map((item, index) => (
              <Accessory
                name={item.name}
                icon={getIconByType(item.type)}
                key={index}
              />
            ))}
          </Acessories>
        )}

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
