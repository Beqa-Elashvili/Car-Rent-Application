import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { CarsType, GlobalContext, TcarsModels } from "./GlobalContext";
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
import axios from "axios";
import { useSession } from "next-auth/react";
import { SiLamborghini } from "react-icons/si";
import { SiAstonmartin } from "react-icons/si";
import { SiFerrari } from "react-icons/si";
import { SiPorsche } from "react-icons/si";
import { SiBugatti } from "react-icons/si";

export function GlobalProvider({ children }: PropsWithChildren) {
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
  const CarsModels = [
    {
      name: "HURACAN COUPE",
      img: SiLamborghini,
    },
    {
      name: "DB12 V8",
      img: SiAstonmartin,
    },
    {
      name: "SF90 SPIDER",
      img: SiFerrari,
    },
    {
      name: "911 GT3",
      img: SiPorsche,
    },
    {
      name: "CHIRON",
      img: SiBugatti,
    },
  ];
  const [location, setLocation] = useState<TLocation>({
    city: null,
    street: null,
  });
  const [collections, setCollections] = useState<TCollecttion[]>([]);
  const [conditions, setConditions] = useState<TConditions[]>(ConditionsRules);
  const [ReserveCars, setReserveCars] = useState<CarsType[]>([]);
  const [ReserveTotalPrice, setReserveTotalPrice] = useState<number | null>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [carsModels, setCarsModels] = useState<TcarsModels[]>(CarsModels);
  const [carData, setCarData] = useState<CarsType[]>([]);

  const { data: session } = useSession();
  const userId = session?.user.id;

  async function GetBrands() {
    try {
      const resp = await axios.get("/api/brands");
      setCollections(resp.data.brands);
    } catch (error) {
      console.log("error twhile fetching brands");
    }
  }
  useEffect(() => {
    const timeout = setTimeout(() => {
      GetBrands();
    }, 10);
    return () => clearTimeout(timeout);
  }, []);

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

  const deleteReservedCar = async (
    id: string,
    isUserId: boolean,
    setIsOpen?: Dispatch<SetStateAction<boolean>>
  ) => {
    try {
      let url = "/api/reservedcars";
      if (isUserId) {
        url += `?userId=${id}`;
        setReserveCars([]);
      } else {
        url += `?id=${id}`;
      }
      const response = await axios.delete(url);
      await fetchReservedCars();
      if (response.status === 200) {
        alert(
          isUserId
            ? "Deleted all cars successfully"
            : "Car deleted successfully"
        );
        if (ReserveCars.length < 0 && setIsOpen) {
          setIsOpen(false);
        }
      }
    } catch (error: any) {
      console.error("Error deleting reserved car(s):", error);
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        loading,
        setLoading,
        error,
        setError,
        carsModels,
        conditions,
        ReserveCars,
        setReserveCars,
        setConditions,
        location,
        setLocation,
        collections,
        setCollections,
        fetchReservedCars,
        ReserveTotalPrice,
        setReserveTotalPrice,
        deleteReservedCar,
        userId,
        carData,
        setCarData,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
