import { StaticImageData } from "next/dist/shared/lib/get-img-props";
import { Dispatch, SetStateAction, createContext } from "react";

interface GlobalContextProps {
  collections: { name: string; logo: string }[];
  setCollections: Dispatch<
    SetStateAction<
      {
        name: string;
        logo: string;
      }[]
    >
  >;
}

export const GlobalContext = createContext<GlobalContextProps>({
  collections: [],
  setCollections: () => {},
});
