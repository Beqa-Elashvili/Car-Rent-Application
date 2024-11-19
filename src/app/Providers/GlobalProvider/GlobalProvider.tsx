import { PropsWithChildren, useEffect, useState } from "react";
import { CarsType, GlobalContext } from "./GlobalContext";
import { TLocation } from "./GlobalContext";
import { TCollecttion } from "./GlobalContext";
import { TConditions } from "./GlobalContext";
import { FaCalendar } from "react-icons/fa";
import { SiFramework } from "react-icons/si";
import { IoShieldCheckmark } from "react-icons/io5";
import { FaCar } from "react-icons/fa";
import { FaUniregistry } from "react-icons/fa";
import { LuBox } from "react-icons/lu";
import { CgDanger } from "react-icons/cg";
import { CardType } from "antd/es/card/Card";
import axios from "axios";
import { useSession } from "next-auth/react";

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

  const ConditionsRules = [
    {
      title: "Driver requirements",
      text1: "AGE 21+",
      text2: "DRIVING EXPERIENCE",
      icon: FaCalendar,
      icon2: SiFramework,
      description:
        "More than 2 years: insurance requirements are standard, without additional conditions.",
    },
    {
      title: "Insurance",
      text1: "OUR CARS ARE INSURED UNDER THE FOLLOWING TYPES OF INSURANCE:",
      icon: IoShieldCheckmark,
      rules: [
        "TPL (liability to third parties) - provides protection against financial losses in the event of damage caused to third parties.",
        "TP (theft insurance) - guarantees protection against the loss of a car in the event of theft.",
        "CDW (insurance against all damage, except glass, mirrors, tires and the underbody of the car) with a deductible of $200.",
      ],
    },
    {
      title: "Car delivery",
      text1: "COMFORTABLE AND CONVENIENT SERVICE FOR OUR CLIENTS",
      icon: FaCar,
      rules: [
        "Guaranteed delivery of the car anywhere in the country.",
        "Punctuality and reliability - we monitor every stage of delivery.",
        "Saving your time and convenience - travel without unnecessary hassle.",
      ],
    },
    {
      title: "Returning a car in another city",
      text1: "UNIQUE OPPORTUNITY",
      icon: FaUniregistry,
      rules: [
        "We offer a unique car rental service that allows you to pick up a car in one location and return it in another, providing the perfect solution for traveling between cities.",
      ],
    },
    {
      title: "Additionally",
      text1: "ADDITIONAL EQUIPMENT FOR RENT",
      icon: LuBox,
      rules: [
        "We offer additional options, such as child seats, GPS navigators, SIM cards with unlimited Internet, Wifi routers, wheel chains, ski and bicycle racks and other accessories that can be ordered additionally.",
      ],
    },
    {
      title: "Important information",
      text1: "ADDITIONAL INFORMATION",
      icon: CgDanger,
      rules: [
        "Unlimited mileage - the daily mileage on our cars is not limited.",
        "Deposit - from 100 to 200 $ depending on the car.",
        "Conclusion of an agreement - we conclude an agreement in two languages ​​- Georgian (official) and the client’s language.",
        "Return your car without unnecessary worries - we do not require you to pay for a car wash upon return, since the car wash is already included in the rental price.",
      ],
    },
  ];

  const [location, setLocation] = useState<TLocation>({
    city: null,
    street: null,
  });
  const [collections, setCollections] = useState<TCollecttion[]>(Brands);
  const [conditions, setConditions] = useState<TConditions[]>(ConditionsRules);
  const [ReserveCars, setReserveCars] = useState<CarsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { data: session } = useSession();
  const userId = session?.user.id;

  async function fetchReservedCars() {
    try {
      if (userId) {
        const response = await axios.get("/api/reservedcars", {
          params: { userId },
        });
        setReserveCars(response.data.ReservedCars);
        setLoading(false);
      }
    } catch (error: any) {
      setError(error.message || "Error fetching reserved cars");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReservedCars();
  }, [userId]);

  return (
    <GlobalContext.Provider
      value={{
        loading,
        setLoading,
        error,
        setError,
        conditions,
        ReserveCars,
        setReserveCars,
        setConditions,
        location,
        setLocation,
        collections,
        setCollections,
        fetchReservedCars,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
