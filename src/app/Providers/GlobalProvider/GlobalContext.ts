import { Dispatch, SetStateAction, createContext } from "react";

export interface TLocation {
  city: string | null;
  street: string | null;
}
export interface TCollecttion {
  name: string | undefined;
  logo: string | undefined;
}

interface GlobalContextProps {
  location: TLocation;
  setLocation: React.Dispatch<React.SetStateAction<TLocation>>;

  collections: TCollecttion[];
  setCollections: Dispatch<SetStateAction<TCollecttion[]>>;
}

export const GlobalContext = createContext<GlobalContextProps>({
  location: { city: null, street: null },
  setLocation: () => {},
  collections: [],
  setCollections: () => {},
});
