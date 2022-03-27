import React from "react";
import { StatusBar } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

import Logo from "../../assets/logo.svg";

import { Container, Header, TotalCars, HeaderContent } from "./styles";

import { Car } from "../../components/Car";

export function Home() {
  const data = {
    brand: "Audi",
    name: "RS Coupé",
    rent: {
      period: "Ao dia",
      price: 120,
    },
    thumbnail: "https://carsguide-res.cloudinary.com/image/upload/f_auto,fl_lossy,q_auto,t_cg_hero_low/v1/editorial/vhs/Audi-RS5-Coupe.png",
  };

  const data2 = {
    brand: "Audi",
    name: "RS Coupé",
    rent: {
      period: "Ao dia",
      price: 120,
    },
    thumbnail: "https://carsguide-res.cloudinary.com/image/upload/f_auto,fl_lossy,q_auto,t_cg_hero_low/v1/editorial/vhs/Audi-RS5-Coupe.png",
  };
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
          <TotalCars>Total de 12 carros</TotalCars>
        </HeaderContent>
      </Header>
      <Car data={data}/>
      <Car data={data2}/>
    </Container>
  );
}
