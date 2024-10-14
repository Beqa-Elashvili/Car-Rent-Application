import { Dispatch, ReactNode, SetStateAction, createContext } from "react";

interface GlobalContextProps {
  collections: any[];
  setCollections: Dispatch<SetStateAction<any[]>>;
}

export const GlobalContext = createContext<GlobalContextProps>({
  collections: [],
  setCollections: () => {},
});
