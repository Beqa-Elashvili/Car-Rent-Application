import { PropsWithChildren, useState } from "react";
import { GlobalContext } from "./GlobalContext";
import { TLocation } from "./GlobalContext";
import { TCollecttion } from "./GlobalContext";

export function GlobalProvider({ children }: PropsWithChildren) {
  const Brands = [
    { name: "Porsche", logo: "/porche-logo.png" },
    { name: "Ferrari", logo: "/ferrari-logo.png" },
    { name: "Lamborghini", logo: "/Lamborghini-Logo.wine.png" },
    { name: "Bentley", logo: "/bentley_PNG20.png" },
    { name: "Mercedes-Benz", logo: "/Mercedes-Benz-Logo.png" },
    { name: "BMW", logo: "/bmw-m-logo.png" },
    { name: "RollsRoyce", logo: "/rolls-royce.png" },
    { name: "Bugatti", logo: "/Bugatti-Logo-PNG-Image.png" },
  ];

  const [collections, setCollections] = useState<TCollecttion[]>(Brands);

  const [location, setLocation] = useState<TLocation>({
    city: null,
    street: null,
  });
  return (
    <GlobalContext.Provider
      value={{
        location,
        setLocation,
        collections,
        setCollections,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
