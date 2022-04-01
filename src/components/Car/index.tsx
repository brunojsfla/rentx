import React from "react";
import { RectButtonProps } from "react-native-gesture-handler";

import GasolineSvg from "../../assets/gasoline.svg";
import {CarType} from '../../types';
import { getIconByType } from "../../utils/getIconByType";

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
interface Props extends RectButtonProps{
  data: CarType;
}

export function Car({ data, ...rest }: Props) {
  const { brand, name, rent, thumbnail, fuel_type } = data;
  const MotorTypeIcon = getIconByType(fuel_type);
  return (
    <Container {...rest}>
      <Details>
        <Brand>{brand}</Brand>
        <Name>{name}</Name>

        <About>
          <Rent>
            <Period>{rent.period}</Period>
            <Price>R$ {rent.price}</Price>
          </Rent>

          <Type>
            <MotorTypeIcon />
          </Type>
        </About>
      </Details>

      <CarImage
        source={{uri: thumbnail}}
        resizeMode="contain"
      />
    </Container>
  );
}
