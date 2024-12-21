import { CardType } from "antd/es/card/Card";
import { Dispatch, SetStateAction, createContext } from "react";
import { IconType } from "react-icons";

export interface TLocation {
  city: string | null;
  street: string | null;
}
export interface TcarsModels {
  name: string;
  img: IconType;
}
export interface TCollecttion {
  name: string | undefined;
  img: string | undefined;
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
  _id: string;
  brand: string;
  make: string;
  model: string;
  year: number;
  carDayCount: number;
  dayPrice: number;
  city_mpg: number;
  highway_mpg: number;
  combination_mpg: number;
  cylinders: number;
  displacement: number;
  drive: string;
  fuel_type: string;
  transmission: string;
  class: string;
  img: string;
  horsepower: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
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

  carData: CarsType[];
  setCarData: Dispatch<SetStateAction<CarsType[]>>;

  carsModels: TcarsModels[];

  ReserveTotalPrice: number | null;
  setReserveTotalPrice: Dispatch<SetStateAction<number | null>>;

  userId: string | undefined;

  fetchReservedCars: () => Promise<void>;
  deleteReservedCar: (
    id: string,
    isUserId: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>
  ) => Promise<void>;
}

export const GlobalContext = createContext<GlobalContextProps>({
  carData: [],
  setCarData: () => {},
  userId: "",
  carsModels: [],
  ReserveTotalPrice: null,
  setReserveTotalPrice: () => {},
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
  deleteReservedCar: async () => {},
});
