import { PropsWithChildren, useState } from "react";

import { GlobalContext } from "./GlobalContext";

export function GlobalProvider({ children }: PropsWithChildren) {
  const [collections, setCollections] = useState<any[]>([]);
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
