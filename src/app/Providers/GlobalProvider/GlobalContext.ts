import { CardType } from "antd/es/card/Card";
import { Dispatch, SetStateAction, createContext } from "react";
import { IconType } from "react-icons";

export interface TLocation {
  city: string | null;
  street: string | null;
}
export interface TCollecttion {
  name: string | undefined;
  logo: string | undefined;
}
export interface TConditions {
  title: string;
  text1: string;
  text2?: string;
  icon: IconType;
  icon2?: IconType;
  description?: string;
  rules?: string[];
}
export interface CarsType {
  carDayCount: number;
  _id: string;
  id: string;
  city_mpg: number;
  class: string;
  combination_mpg: number;
  cylinders: number;
  displacement: number;
  drive: string;
  fuel_type: string;
  highway_mpg: number;
  make: string;
  model: string;
  transmission: string;
  year: number;
}

interface GlobalContextProps {
  location: TLocation;
  setLocation: React.Dispatch<React.SetStateAction<TLocation>>;

  collections: TCollecttion[];
  setCollections: Dispatch<SetStateAction<TCollecttion[]>>;

  conditions: TConditions[];
  setConditions: Dispatch<SetStateAction<TConditions[]>>;

  ReserveCars: CarsType[];
  setReserveCars: Dispatch<SetStateAction<CarsType[]>>;

  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;

  error: null;
  setError: Dispatch<SetStateAction<null>>;

  fetchReservedCars: () => Promise<void>;
}

export const GlobalContext = createContext<GlobalContextProps>({
  error: null,
  setError: () => {},
  loading: false,
  setLoading: () => {},
  ReserveCars: [],
  setReserveCars: () => {},
  location: { city: null, street: null },
  setLocation: () => {},
  collections: [],
  setCollections: () => {},
  conditions: [],
  setConditions: () => {},
  fetchReservedCars: async () => {},
});
