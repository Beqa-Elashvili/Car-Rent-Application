import { PropsWithChildren, useState } from "react";

import { GlobalContext } from "./GlobalContext";

export function GlobalProvider({ children }: PropsWithChildren) {
  const [collections, setCollections] = useState<{ name: string; logo: any }[]>(
    [
      { name: "Porsche", logo: "/porche-logo.png" },
      { name: "Ferrari", logo: "/ferrari-logo.png" },
      { name: "Lamborghini", logo: "/Lamborghini-Logo.wine.png" },
      { name: "Bentley", logo: "/bentley_PNG20.png" },
      { name: "Mercedes-Benz", logo: "/Mercedes-Benz-Logo.png" },
      { name: "BMW", logo: "/bmw-m-logo.png" },
      { name: "Rolls Royce", logo: "/rolls-royce.png" },
      { name: "Bugatti", logo: "/Bugatti-Logo-PNG-Image.png" },
    ]
  );

  return (
    <GlobalContext.Provider
      value={{
        collections,
        setCollections,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
