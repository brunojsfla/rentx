import React from "react";
import { RectButtonProps } from "react-native-gesture-handler";

import { getIconByType } from "../../utils/getIconByType";
import { Car as ModelCar } from "../../database/model/Car";

import {
  Container,
  Details,
  Brand,
  Name,
  About,
  Rent,
  Period,
  Price,
  Type,
  CarImage,
} from "./styles";
import { useNetInfo } from "@react-native-community/netinfo";
interface Props extends RectButtonProps {
  data: ModelCar;
}

export function Car({ data, ...rest }: Props) {
  const netInfo = useNetInfo();
  const { brand, name, period, price, thumbnail, fuel_type } = data;
  const MotorTypeIcon = getIconByType(fuel_type);
  return (
    <Container {...rest}>
      <Details>
        <Brand>{brand}</Brand>
        <Name>{name}</Name>

        <About>
          {netInfo.isConnected && (
            <Rent>
              <Period>{period}</Period>
              <Price>R$ {price}</Price>
            </Rent>
          )}

          <Type>
            <MotorTypeIcon />
          </Type>
        </About>
      </Details>

      <CarImage source={{ uri: thumbnail }} resizeMode="contain" />
    </Container>
  );
}
