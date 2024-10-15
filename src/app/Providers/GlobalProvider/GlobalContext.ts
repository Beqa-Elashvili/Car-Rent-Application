import { StaticImageData } from "next/dist/shared/lib/get-img-props";
import { Dispatch, SetStateAction, createContext } from "react";

interface GlobalContextProps {
  collections: any[];
  setCollections: Dispatch<SetStateAction<any[]>>;
}

export const GlobalContext = createContext<GlobalContextProps>({
  collections: [],
  setCollections: () => {},
});
