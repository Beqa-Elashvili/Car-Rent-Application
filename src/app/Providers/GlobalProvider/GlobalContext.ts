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

interface GlobalContextProps {
  location: TLocation;
  setLocation: React.Dispatch<React.SetStateAction<TLocation>>;

  collections: TCollecttion[];
  setCollections: Dispatch<SetStateAction<TCollecttion[]>>;

  conditions: TConditions[];
  setConditions: Dispatch<SetStateAction<TConditions[]>>;
}

export const GlobalContext = createContext<GlobalContextProps>({
  location: { city: null, street: null },
  setLocation: () => {},
  collections: [],
  setCollections: () => {},
  conditions: [],
  setConditions: () => {},
});
