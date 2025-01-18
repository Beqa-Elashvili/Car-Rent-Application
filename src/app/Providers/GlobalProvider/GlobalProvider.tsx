import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  CarsType,
  GlobalContext,
  TcarsModels,
  TRentalTracks,
} from "./GlobalContext";
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
      index: 0,
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
      index: 1,
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
      index: 2,
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
      index: 3,
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

      index: 4,
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
  const [reservedTracks, setReservedTracks] = useState<TRentalTracks[]>([]);

  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});

  const { data: session } = useSession();
  const userId = session?.user.id;

  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const resp = await axios.get("/api/cars?limit=45");
        setCarData(resp.data.cars);
      } catch (error: unknown) {
        setError(null);
      } finally {
        setLoading(false);
      }
    }, 10);
    return () => clearTimeout(timeout);
  }, []);

  async function fetchReservedTrack() {
    try {
      const resp = await axios.get(`/api/reservedtracks?userId=${userId}`);
      setReservedTracks(resp.data.ReservedTracks);
    } catch (error) {
      console.log(error);
    }
  }

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
      const response = await axios.get("/api/reservedcars", {
        params: { userId },
      });
      setReserveCars(response.data.ReservedCars);
      setLoading(false);
    } catch (error: any) {
      setError(error.message || "Error fetching reserved cars");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userId) {
      fetchReservedCars();
      fetchReservedTrack();
    }
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
        if (ReserveCars.length < 0 && setIsOpen) {
          setIsOpen(false);
        }
      }
    } catch (error: any) {
      console.error("Error deleting reserved car(s):", error);
    }
  };

  const addCarToReserve = async (
    car: CarsType,
    ChangeCarDayCount: (
      car: CarsType,
      isDayCountIncrease: boolean,
      action: string
    ) => void,
    setIsOpen?: (open: boolean) => void
  ) => {
    try {
      const userId = session?.user.id;
      if (!userId) {
        console.error("User is not authenticated");
        return;
      }

      const Existeditem = ReserveCars.find(
        (item: CarsType) => item.img === car.img
      );

      if (Existeditem) {
        ChangeCarDayCount(car, true, "increase");
        return;
      } else {
        await axios.post("/api/reservedcars", {
          userId,
          car,
        });
      }
      await fetchReservedCars();
      if (setIsOpen) setIsOpen(true);
    } catch (error: any) {
      console.error("Error adding car to reserve:", error);
    }
  };

  const ChangeCarDayCount = async (
    car: CarsType,
    AddCar: boolean,
    IncreseOrDecrese?: string,
    setIsOpen?: Dispatch<SetStateAction<boolean>>
  ) => {
    try {
      setLoadingStates((prev) => ({
        ...prev,
        [car._id]: true,
      }));

      if (!userId) {
        console.error("User is not authenticated");
        return;
      }
      if (IncreseOrDecrese === "decrease" && car.carDayCount === 1) {
        await deleteReservedCar(car._id, false, setIsOpen);
        return;
      }
      const key = AddCar ? { carImg: car.img } : { carId: car._id };
      await axios.put("/api/reservedcars", {
        userId,
        ...key,
        action: IncreseOrDecrese,
      });
      await fetchReservedCars();
    } catch (error: any) {
      console.error("Error decrementing car day count:", error);
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        [car._id]: false,
      }));
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
        setCarsModels,
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
        addCarToReserve,
        userId,
        carData,
        setCarData,
        tracks,
        setTracks,
        loadingStates,
        setLoadingStates,
        ChangeCarDayCount,
        reservedTracks,
        setReservedTracks,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
