import { RFValue } from "react-native-responsive-fontsize";
import { FlatList, FlatListProps } from "react-native";
import styled from "styled-components/native";

import { CarType } from "../../types";
import { RectButton } from "react-native-gesture-handler";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background_primary};
`;

export const Header = styled.View`
  width: 100%;
  height: 113px;

  background-color: ${({ theme }) => theme.colors.header};

  justify-content: flex-end;
  padding: 32px 24px;
`;

export const HeaderContent = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;

export const TotalCars = styled.Text`
  font-size: ${RFValue(15)}px;
  font-family: ${({ theme }) => theme.fonts.primary_400};

  color: ${({ theme }) => theme.colors.text};
`;

export const CarList = styled(FlatList as new (props: FlatListProps<CarType>) => FlatList<CarType>).attrs({
  contentContainerStyle: {
    padding: 24,
  },
  showsVerticalScrollIndicator: false,
})``;

export const ContainerLoading = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const MyCarsButton = styled(RectButton)`
  width: 60px;
  height: 60px;

  background-color: ${({ theme }) => theme.colors.main};
  border-radius: 30px;

  align-items: center;
  justify-content: center;

  position: absolute;
  bottom: 13px;
  right: 22px;
`;
