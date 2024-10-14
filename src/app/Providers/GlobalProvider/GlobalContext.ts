import { Dispatch, ReactNode, SetStateAction, createContext } from "react";

interface GlobalContextProps {
  saleProducts: any[];
  setSaleProducts: Dispatch<SetStateAction<any[]>>;
}

export const GlobalContext = createContext<GlobalContextProps>({
  saleProducts: [],
  setSaleProducts: () => {},
});
