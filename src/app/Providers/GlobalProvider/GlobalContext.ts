import { promises } from "dns";
import { Dispatch, SetStateAction, createContext } from "react";
import { IconType } from "react-icons";

export interface TLocation {
  city: string | null;
  street: string | null;
}
export interface TFormtype {
  brand: string;
  model: string;
  class: string;
}

export interface TFormtype {
  brand: string;
  model: string;
  class: string;
}

export interface TRentalTracks {
  title: string;
  loop: number;
  rentPrice: number;
  dayRentPrice: number;
  location: string;
  description: string;
  dayCount: number; // Optional field
  dayStart: string;
  dayEnd: string;
  oneLap?: boolean; // Optional field
  totalPrice: number;
  _id: string;
}
export interface Ttracks {
  title: string;
  loop: number;
  rentPrice: number;
  dayRentPrice: number;
  location: string;
  description: string;
  established: number;
  famousEvents: string[];
  notes: string;
  index: number;
  img: string;
}
export interface TcarsModels {
  name: string;
  img: IconType;
}
export interface TCollecttion {
  name: string;
  img: string;
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
  setCarsModels: Dispatch<SetStateAction<TcarsModels[]>>;

  ReserveTotalPrice: number | null;
  setReserveTotalPrice: Dispatch<SetStateAction<number | null>>;

  tracks: Ttracks[];
  setTracks: Dispatch<SetStateAction<Ttracks[]>>;

  reservedTracks: TRentalTracks[];
  setReservedTracks: Dispatch<SetStateAction<TRentalTracks[]>>;

  userId: string | undefined;

  fetchReservedCars: () => Promise<void>;
  deleteReserveTrack: (_id: string, userid: boolean) => Promise<void>;
  fetchReservedTrack: () => Promise<void>;

  deleteReservedCar: (
    id: string,
    isUserId: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>
  ) => Promise<void>;

  addCarToReserve: (
    car: CarsType,
    ChangeCarDayCount: (
      car: CarsType,
      isDayCountIncrease: boolean,
      action: string
    ) => void,
    setIsOpen?: (open: boolean) => void
  ) => Promise<void>;

  ChangeCarDayCount: (
    car: CarsType,
    AddCar: boolean,
    IncreseOrDecrese?: string,
    setIsOpen?: Dispatch<SetStateAction<boolean>>
  ) => Promise<void>;

  loadingStates: {
    [key: string]: boolean;
  };
  setLoadingStates: Dispatch<
    SetStateAction<{
      [key: string]: boolean;
    }>
  >;
}

export const GlobalContext = createContext<GlobalContextProps>({
  carData: [],
  setCarData: () => {},
  userId: "",
  carsModels: [],
  setCarsModels: () => {},
  ReserveTotalPrice: null,
  setReserveTotalPrice: () => {},
  error: null,
  setError: () => {},
  loadingStates: {},
  setLoadingStates: () => {},
  loading: false,
  setLoading: () => {},
  ReserveCars: [],
  setReserveCars: () => {},
  location: { city: null, street: null },
  setLocation: () => {},
  collections: [],
  setCollections: () => {},
  addCarToReserve: async () => {},
  deleteReserveTrack: async () => {},
  reservedTracks: [],
  setReservedTracks: () => {},
  conditions: [],
  tracks: [],
  setTracks: () => {},
  setConditions: () => {},
  fetchReservedCars: async () => {},
  deleteReservedCar: async () => {},
  ChangeCarDayCount: async () => {},
  fetchReservedTrack: async () => {},
});
