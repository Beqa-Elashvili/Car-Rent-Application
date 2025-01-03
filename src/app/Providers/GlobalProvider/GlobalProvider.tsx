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
import { Ttracks } from "./GlobalContext";
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
import Numburgring from "/10-nurburgring.jpg";
import circuitDespa from "/circuitDespa .jpg";
import CircuitDelaSarthe from "/Circuit_de_la_Sarthe_v2.png";
import Silverstone from "/Silverstone-GP-2021.png";
import MonacoGranPrix from "/Monaco-granPrix.png";

export function GlobalProvider({ children }: PropsWithChildren) {
  const RentTracks = [
    {
      title: "Nürburgring",
      loop: 20.83,
      rentPrice: 200,
      dayRentPrice: 2500,
      location: "Nürburg, Germany",
      description:
        "Known as 'The Green Hell,' the Nürburgring is a highly challenging 20.8 km circuit located in the Eifel Mountains. It is famed for its difficult turns, elevation changes, and unpredictable weather. The track is used for both racing and public driving events.",
      established: 1927,
      famousEvents: ["24 Hours of Nürburgring", "German Grand Prix"],
      notes:
        "The track is used for both public and private events. Prices for private rentals can vary based on the event.",
      img: "/10-nurburgring.jpg",
    },
    {
      title: "Monaco Grand Prix",
      loop: 3.34,
      rentPrice: 300,
      dayRentPrice: 3500,
      location: "Monaco, Monte Carlo",
      description:
        "The Monaco Grand Prix is one of the most prestigious and famous street races in the world. The narrow and winding track runs through the streets of Monte Carlo, offering little room for error. It is a regular event on the Formula 1 calendar.",
      established: 1929,
      famousEvents: ["Monaco Grand Prix", "Formula E Monaco ePrix"],
      notes:
        "Because the track is located in an urban area, renting it for private events is incredibly expensive and difficult to arrange.",
      img: "/Monaco-granPrix.png",
    },
    {
      title: "Silverstone Circuit",
      loop: 5.89,
      rentPrice: 180,
      dayRentPrice: 2200,
      location: "Silverstone, United Kingdom",
      description:
        "Silverstone is one of the oldest and most famous racing circuits in the world, having hosted the first-ever Formula 1 World Championship race in 1950. The circuit is fast and technical, featuring a mix of high-speed corners and challenging sections.",
      established: 1948,
      famousEvents: ["British Grand Prix", "Formula 1"],
      notes:
        "The rent price can fluctuate based on the event and demand. Silverstone is commonly used for both professional racing and public track days.",
      img: "/Silverstone-GP-2021.png",
    },
    {
      title: "Circuit de Spa-Francorchamps",
      loop: 7.004,
      rentPrice: 220,
      dayRentPrice: 2700,
      location: "Stavelot, Belgium",
      description:
        "Circuit de Spa-Francorchamps is one of the most famous and challenging tracks in the world. Known for its elevation changes, fast corners like Eau Rouge, and unpredictable weather, it is considered one of the most exciting tracks in motorsport.",
      established: 1921,
      famousEvents: ["Belgian Grand Prix", "6 Hours of Spa"],
      notes:
        "Private rentals are available, but prices are higher during major events. It's often used for endurance races and various car events.",
      img: "/circuitDespa .jpg",
    },
    {
      title: "Le Mans Circuit (Circuit de la Sarthe)",
      loop: 13.626,
      rentPrice: 250,
      dayRentPrice: 3000,
      location: "Le Mans, France",
      description:
        "The Circuit de la Sarthe, home of the 24 Hours of Le Mans, is famous for its long straights and technical corners. This endurance racing track has seen some of the most iconic moments in motorsport history and is known for testing both car and driver over a grueling 24-hour race.",
      established: 1923,
      famousEvents: ["24 Hours of Le Mans", "Le Mans Classic"],
      notes:
        "Private use of the circuit for racing or testing is available but can be expensive, especially during the lead-up to the 24-hour race.",
      img: "/Circuit_de_la_Sarthe_v2.png",
    },
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
  const [tracks, setTracks] = useState<Ttracks[]>(RentTracks);
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
        tracks,
        setTracks,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
