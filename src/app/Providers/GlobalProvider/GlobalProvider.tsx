import { PropsWithChildren, useState } from "react";

import { GlobalContext } from "./GlobalContext";

export function GlobalProvider({ children }: PropsWithChildren) {
  const [saleProducts, setSaleProducts] = useState<any[]>([]);
  return (
    <GlobalContext.Provider
      value={{
        saleProducts,
        setSaleProducts,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
