"use client";
import { useGlobalProvider } from "@/app/Providers/GlobalProvider";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Checkbox, Button, Slider, Spin, Form, Select } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { TiDeleteOutline } from "react-icons/ti";
import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";
import {
  CarsType,
  TCollecttion,
  TFormtype,
} from "@/app/Providers/GlobalProvider/GlobalContext";
import { useRouter } from "next/navigation";
import { Skeleton } from "antd";
import { useSession } from "next-auth/react";
import { useForm } from "antd/es/form/Form";
import useGetUpdatedPrice from "@/app/hooks/GetDiscounthook/useGetDiscount";

export default function Page({
  params,
}: {
  params: {
    brand?: string | undefined;
    model?: string | undefined;
    class: string | undefined;
  };
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { getUpdatedPrice } = useGetUpdatedPrice();

  const {
    collections,
    ReserveCars,
    loading,
    setLoading,
    carData,
    error,
    setError,
    deleteReservedCar,
    addCarToReserve,
    loadingStates,
    ChangeCarDayCount,
  } = useGlobalProvider();

  const [maxMinprices, setMaxMinPrices] = useState({ min: 0, max: 2000 });
  const [brand, setBrandData] = useState<CarsType[]>([]);
  const [FilterisOpen, setFilterisOpen] = useState<boolean>(false);
  const { data: session } = useSession();
  const router = useRouter();
  const [form] = useForm();
  const numb = 9;

  const sortByPrices = (values: number[]) => {
    setMaxMinPrices({
      min: values[0],
      max: values[1],
    });
  };

  const [selectedDays, setSelectedDays] = useState<number[]>(
    Array(brand.length).fill(0)
  );
  const [prices, setPrices] = useState<number[]>(
    brand.map((car) => car.dayPrice)
  );

  async function GetCarData(
    min?: number,
    max?: number,
    brand?: string,
    model?: string,
    carClass?: string,
    page?: number
  ) {
    try {
      setLoading(true);
      if (min !== 0) {
        page = 1;
      }
      console.log(min);
      const params = new URLSearchParams();
      if (brand && brand !== "All")
        params.append("brand", decodeURIComponent(brand));
      if (model && model !== "All")
        params.append("model", decodeURIComponent(model));
      if (min) params.append("minDayPrice", String(min));
      if (max) params.append("maxDayPrice", String(max));
      if (carClass && carClass !== "All") {
        const formattedCarClass =
          carClass.charAt(0).toUpperCase() + carClass.slice(1);
        params.append("class", decodeURIComponent(formattedCarClass));
      }

      const par = new URLSearchParams({
        page: String(page),
        limit: "5",
        ...params,
      });
      const url = `/api/cars?${params}&${par.toString()}`;
      const resp = await axios.get(url);
      const newCars = resp.data.cars;
      if (page !== 1) setBrandData((prevCars) => [...prevCars, ...newCars]);
      else {
        setBrandData(newCars);
      }

      if (newCars.length === 0) {
        setHasMore(false);
      }
      setPrices([]);
      setSelectedDays([]);
      setLoading(false);
      setError(null);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message);
        console.log("error thile fatch brand data");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const { brand, model, class: carClass } = params;
    const timeoutId = setTimeout(() => {
      GetCarData(
        maxMinprices.min,
        maxMinprices.max,
        brand,
        model,
        carClass,
        page
      );
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [maxMinprices, params.brand, params.model, page]);

  const calculateTotalPrice = () => {
    const total = ReserveCars.reduce((accumulatedTotal, item) => {
      const { updatedPrice } = getUpdatedPrice(item.dayPrice, item.carDayCount);
      const totalCarPrice = updatedPrice * item.carDayCount;
      return accumulatedTotal + totalCarPrice;
    }, 0);

    localStorage.setItem("reserveTotalPrice", total.toString());
    return total;
  };

  useEffect(() => {
    if (ReserveCars.length === 0) {
      setIsOpen(false);
    }
  }, [ReserveCars]);

  const handleDaySelection = async (index: number, days: number) => {
    setSelectedDays((prevDays) => {
      const updatedDays = [...prevDays];
      updatedDays[index] = days;
      return updatedDays;
    });

    const basePrice = brand[index].dayPrice;
    const { updatedPrice } = getUpdatedPrice(basePrice, days);

    setPrices((prevPrices) => {
      const updatedPrices = [...prevPrices];
      updatedPrices[index] = updatedPrice;
      return updatedPrices;
    });
  };

  const [brandName, setBrandName] = useState<string>("");
  const [model, setModel] = useState<string | undefined>("");
  const [carClass, setCarClass] = useState<string | undefined>("");
  const [chosenModels, setChosenModels] = useState<string[]>([]);
  const [chosenClass, setChosenClass] = useState<string[]>([]);

  const FilteredModels = (brandName: string, model: string) => {
    const CarsModels = carData?.filter(
      (item, index, self) =>
        item.brand === brandName &&
        self.findIndex((car) => car.model === item.model) === index
    );
    setChosenModels(CarsModels.map((item: CarsType) => item.model));

    const CarsClass = carData?.filter(
      (item, index, self) =>
        self.findIndex(
          (car) =>
            car.brand === brandName &&
            (model ? car.model === model : true) &&
            car.class === item.class
        ) === index
    );
    setChosenClass(CarsClass.map((item: CarsType) => item.class));
  };

  const ClearModelsAndClases = () => {
    form.resetFields();
    setCarClass(undefined);
    setModel(undefined);
    setChosenModels([]);
    setChosenClass([]);
  };

  useEffect(() => {
    FilteredModels(brandName, (model && model) || "");
  }, [brandName, model]);

  const onFinish = (values: TFormtype) => {
    let url = `/pages/brands/${values.brand}`;
    if (values.model) {
      url += `/${values.model}`;
    } else {
      url += `/All`;
    }
    if (values.class) {
      url += `/${values.class}`;
    } else {
      url += "/All";
    }
    router.push(url);
  };

  const loadMoreData = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleSortBrands = (sortType: string) => {
    let newBrand = [...brand];

    switch (sortType) {
      case "price-asc":
        newBrand = newBrand.sort((a, b) => a.dayPrice - b.dayPrice);
        break;
      case "price-desc":
        newBrand = newBrand.sort((a, b) => b.dayPrice - a.dayPrice);
        break;
      case "name-asc":
        newBrand = newBrand.sort((a, b) => a.model.localeCompare(b.model));
        break;
      case "name-desc":
        newBrand = newBrand.sort((a, b) => b.model.localeCompare(a.model));
        break;
      default:
        break;
    }
    setBrandData(newBrand);
  };
  const handleReserved = () => {
    if (FilterisOpen) {
      setFilterisOpen(false);
    }
    setIsOpen(true);
  };

  return (
    <div className="bg-orange-500 min-h-screen relative p-2 h-full">
      <div>
        <AnimatePresence>
          {FilterisOpen && (
            <motion.div
              key={"modal"}
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 100 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
              className="fixed overflow-y-auto top-0 right-0 w-4/5 h-screen bg-white z-50 p-2"
            >
              <button
                onClick={() => setFilterisOpen(false)}
                className="p-2 w-40 bg-red-500 hover:bg-red-600 rounded-xl float-end"
              >
                close
              </button>
              <div className="mt-12">
                <div className="bg-gray-200 h-px w-full"></div>
                <div className="bg-orange-900 flex md:hidden flex-col gap-2 min-h-screen z-40 rounded p-2">
                  <Select
                    className="flex items-center gap-2 overflow-hidden"
                    defaultValue={params.brand}
                    value={params.brand}
                    onChange={(value) =>
                      router.push(`/pages/brands/${value}/All/All`)
                    }
                  >
                    {collections.map((item: TCollecttion, index: number) => (
                      <Select.Option
                        key={index}
                        value={item.name}
                        className={` flex items-center  cursor-pointer hover:bg-gray-700 h-14 w-full overflow-hidden rounded-xl p-2 gap-2 ${
                          params.brand === item.name && "bg-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Image
                            width={2000}
                            height={2000}
                            className="w-8 h-8 object-contain"
                            src={item.img}
                            alt="logo"
                          />
                          <p className="font-serif">{item.name}</p>
                        </div>
                      </Select.Option>
                    ))}
                  </Select>
                  <Button
                    disabled={ReserveCars.length === 0}
                    onClick={handleReserved}
                    className="rounded w-full border-none font-medium text-white bg-green-600 p-2 cursor-pointer hover:bg-green-700 mt-2"
                  >
                    Reserved
                  </Button>
                  <div className="border text-center text-white p-2 mt-2 rounded">
                    <h1 className="font-medium">PRICES SORT</h1>
                    <Slider
                      onChange={(e: number[]) => sortByPrices(e)}
                      range
                      max={2000}
                      min={0}
                      defaultValue={[maxMinprices.min, maxMinprices.max]}
                    />
                    <div className="flex w-full gap-2">
                      <div className="border w-full border-orange-500 rounded  p-2">
                        $ {maxMinprices.min}
                      </div>
                      <div className="border w-full border-orange-500 rounded  p-2">
                        $ {maxMinprices.max}
                      </div>
                    </div>
                  </div>
                  <Form<TFormtype>
                    form={form}
                    onFinish={onFinish}
                    className="flex border p-2 rounded-xl flex-col justif-center gap-2"
                  >
                    <Form.Item
                      name="brand"
                      rules={[
                        { required: true, message: "Please input a value!" },
                      ]}
                    >
                      <Select
                        value={brandName}
                        onChange={(e) => setBrandName(e)}
                        placeholder="Select an brand"
                      >
                        {collections?.map(
                          (item: TCollecttion, index: number) => (
                            <Select.Option key={index} value={item.name}>
                              {item.name}
                            </Select.Option>
                          )
                        )}
                      </Select>
                    </Form.Item>
                    <Form.Item name="model">
                      <Select
                        value={model}
                        onChange={(e) => setModel(e)}
                        placeholder="Select an model"
                      >
                        {chosenModels?.map((item: string, index: number) => (
                          <Select.Option key={index} value={item}>
                            {item}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name="class">
                      <Select
                        value={carClass}
                        onChange={(e) => setCarClass(e)}
                        placeholder="Select an class"
                      >
                        {chosenClass?.map((item: string, index: number) => (
                          <Select.Option key={index} value={item}>
                            {item}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Button onClick={ClearModelsAndClases}>Clear</Button>
                    <Button type="primary" htmlType="submit">
                      Search
                    </Button>
                  </Form>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key={"modal"}
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 100 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
              className="fixed overflow-y-auto top-0 right-0 w-4/5 md:w-1/2 h-screen bg-white z-50 p-2"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 w-40 bg-red-500 hover:bg-red-600 rounded-xl float-end"
              >
                close
              </button>
              <div className="mt-12">
                <div className="bg-gray-200 h-px w-full"></div>
                <div className="py-4 flex flex-col gap-4">
                  {ReserveCars.map((item: CarsType) => {
                    const handleTotalPrices = () => {
                      let updated = 0;
                      const { updatedPrice, discountPercentage } =
                        getUpdatedPrice(item.dayPrice, item.carDayCount);
                      updated += updatedPrice * item.carDayCount;
                      return { updated, discountPercentage };
                    };
                    const { discountPercentage, updated } = handleTotalPrices();

                    return (
                      <div key={item._id}>
                        <div className="bg-yellow-500 p-2 rounded-xl md:flex items-center justify-center">
                          <Image
                            width={2000}
                            height={2000}
                            className="w-40 m-auto md:text-start"
                            src={item.img}
                            alt="Carimg"
                          />
                          <div className="flex flex-col w-full">
                            <p className="font-medium hidden md:block text-lg">
                              {item.make.toUpperCase()} |{" "}
                              {item.model.toUpperCase()}
                            </p>
                            <div className="font-medium block md:hidden flex flex-col">
                              <p> {item.make.toUpperCase()}</p>
                              <p> {item.model.toUpperCase()}</p>
                            </div>
                            <div className="md:flex justify-between w-full">
                              <div className="text-sm">
                                <p>Price per Day: ${item.dayPrice}</p>
                                <p>Period: 8+ days</p>
                              </div>
                              <div className="flex gap-2 mt-2 md:mt-0 items-center justify-between">
                                <button
                                  onClick={() =>
                                    ChangeCarDayCount(item, false, "increase")
                                  }
                                >
                                  <CiCirclePlus className="size-8  text-gray-600 hover:text-gray-700" />
                                </button>
                                {loadingStates[item._id] ? (
                                  <Spin />
                                ) : (
                                  <div>{item.carDayCount}</div>
                                )}
                                <button
                                  onClick={() => {
                                    ChangeCarDayCount(item, false, "decrease");
                                  }}
                                >
                                  <CiCircleMinus className="size-8 text-gray-600 hover:text-gray-700" />
                                </button>
                                <div>${updated}</div>
                                {discountPercentage !== 0 && (
                                  <span className="text-red-500">
                                    -{discountPercentage} %
                                  </span>
                                )}
                                <button
                                  className="text-end"
                                  onClick={() =>
                                    deleteReservedCar(
                                      item._id,
                                      false,
                                      setIsOpen
                                    )
                                  }
                                >
                                  <TiDeleteOutline className="size-8 text-gray-600 hover:text-gray-700" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-200 mt-4 h-px w-full"></div>
                      </div>
                    );
                  })}
                </div>
                <h1 className="float-end font-medium text-xl">
                  TOTAL: ${calculateTotalPrice()}
                </h1>
                <Button
                  disabled={!session}
                  onClick={() =>
                    session &&
                    deleteReservedCar(session?.user?.id, true, setIsOpen)
                  }
                  className="w-full mt-2 bg-red-500 border-none p-6 font-medium text-xl text-white"
                >
                  Delete All
                </Button>
                <Button
                  onClick={() => router.push("/pages/reserveCars")}
                  className="w-full mt-2 bg-green-500 border-none p-6 font-medium text-xl text-white"
                >
                  RESERVED
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex justify-between text-white h-full">
          <div className="bg-orange-900 hidden md:flex flex-col gap-2 min-h-screen z-40 rounded p-2 w-60">
            <Select
              placeholder="Sorting"
              onChange={(value) => handleSortBrands(value)}
              className="font-mono text-xl  border-none"
            >
              <Select.Option value={"price-asc"}>
                Price: Low to High
              </Select.Option>
              <Select.Option value={"price-desc"}>
                Price: High to Low
              </Select.Option>
              <Select.Option value={"name-asc"}>Name: A to Z</Select.Option>
              <Select.Option value={"name-desc"}>Name: Z to A</Select.Option>
            </Select>
            {collections.map((item: TCollecttion, index: number) => (
              <div
                key={index}
                onClick={() =>
                  router.push(`/pages/brands/${item.name}/All/All`)
                }
                className={`flex items-center cursor-pointer hover:bg-gray-700 h-14 overflow-hidden rounded-xl p-2 gap-2 ${
                  params.brand === item.name && "bg-gray-800"
                }`}
              >
                <Image
                  width={2000}
                  height={2000}
                  className="w-12 h-12 object-contain"
                  src={item.img}
                  alt="logo"
                />
                <p>{item.name}</p>
              </div>
            ))}
            <Button
              disabled={ReserveCars.length === 0}
              onClick={() => setIsOpen(!isOpen)}
              className="rounded w-full border-none font-medium text-white bg-green-600 p-2 cursor-pointer hover:bg-green-700 mt-2"
            >
              Reserved
            </Button>
            <div className="border text-center p-2 mt-2 rounded">
              <h1 className="font-medium">PRICES SORT</h1>
              <Slider
                onChange={(e: number[]) => sortByPrices(e)}
                range
                max={1500}
                min={0}
                defaultValue={[maxMinprices.min, maxMinprices.max]}
              />
              <div className="flex w-full gap-2">
                <div className="border w-full border-orange-500 rounded  p-2">
                  $ {maxMinprices.min}
                </div>
                <div className="border w-full border-orange-500 rounded  p-2">
                  $ {maxMinprices.max}
                </div>
              </div>
            </div>
            <Form<TFormtype>
              form={form}
              onFinish={onFinish}
              className="flex border p-2 rounded-xl flex-col justif-center gap-2"
            >
              <Form.Item
                name="brand"
                rules={[{ required: true, message: "Please input a value!" }]}
              >
                <Select
                  value={brandName}
                  onChange={(e) => setBrandName(e)}
                  placeholder="Select an brand"
                >
                  {collections?.map((item: TCollecttion, index: number) => (
                    <Select.Option key={index} value={item.name}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="model">
                <Select
                  value={model}
                  onChange={(e) => setModel(e)}
                  placeholder="Select an model"
                >
                  {chosenModels?.map((item: string, index: number) => (
                    <Select.Option key={index} value={item}>
                      {item}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="class">
                <Select
                  value={carClass}
                  onChange={(e) => setCarClass(e)}
                  placeholder="Select an class"
                >
                  {chosenClass?.map((item: string, index: number) => (
                    <Select.Option key={index} value={item}>
                      {item}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Button onClick={ClearModelsAndClases}>Clear</Button>
              <Button type="primary" htmlType="submit">
                Search
              </Button>
            </Form>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full md:w-10/12 gap-8 p-2 text-center">
              {Array.from({ length: numb }).map((_item, index: number) => (
                <div key={index} className="flex flex-col gap-4">
                  <Skeleton.Image active />
                  <Skeleton.Input active size="large" />
                  <Skeleton.Input active size="large" />
                  <Image
                    width={2000}
                    height={2000}
                    className="w-3/5 m-auto"
                    src="/Animation.gif"
                    unoptimized
                    alt="img"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-orange-900 w-full md:w-10/12 p-2 flex flex-col justify-between items-center rounded-xl">
              <div className="flex md:hidden w-full font-mono text-2xl gap-4 justify-between">
                <Select
                  placeholder="Sort"
                  onChange={(value) => handleSortBrands(value)}
                  className="font-mono text-xl  border-none w-1/2"
                >
                  <Select.Option value={"price-asc"}>
                    Price: Low to High
                  </Select.Option>
                  <Select.Option value={"price-desc"}>
                    Price: High to Low
                  </Select.Option>
                  <Select.Option value={"name-asc"}>Name: A to Z</Select.Option>
                  <Select.Option value={"name-desc"}>
                    Name: Z to A
                  </Select.Option>
                </Select>
                <Button
                  onClick={() => setFilterisOpen(!FilterisOpen)}
                  className="border-none w-1/2"
                >
                  Filter
                </Button>
              </div>
              <div>
                {error && <div className="text-center mt-12">{error}</div>}
                <div className="grid items-center text-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-2">
                  {brand?.map((car: CarsType, index: number) => {
                    return (
                      <div
                        key={car._id}
                        className="bg-gray-300 hover:cursor-pointer hover:bg-gray-400 text-white rounded-xl"
                      >
                        <Image
                          width={2000}
                          height={2000}
                          className="h-40 text-center w-full object-contain"
                          src={car.img}
                          alt="carimg"
                          onClick={() =>
                            router.push(`/pages/solocar/${car._id}`)
                          }
                        />
                        <div className="bg-orange-700 text-orange-200 font-serif p-2 rounded-b-xl">
                          <h1 className="text-2xl font-mono min-h-16">
                            {car.make.toUpperCase()} {car.model.toUpperCase()}
                          </h1>
                          <h1 className="mt-2 text-lg">
                            {car.displacement} | {car.transmission} |{" "}
                            {car.fuel_type}
                          </h1>
                          <h1 className="mt-2 text-2xl text-yellow-400">
                            $ {prices[index] ? prices[index] : car.dayPrice}
                          </h1>
                          <div className="flex gap-2 mt-2">
                            <Checkbox
                              checked={selectedDays[index] === 2}
                              onChange={() => handleDaySelection(index, 2)}
                              type="checkbox"
                            />
                            <p>2 days</p>
                          </div>
                          <div className="flex gap-2">
                            <Checkbox
                              checked={selectedDays[index] === 4}
                              onChange={() => handleDaySelection(index, 4)}
                              type="checkbox"
                            />
                            <p>4 days</p>
                          </div>
                          <div className="flex gap-2">
                            <Checkbox
                              checked={selectedDays[index] === 6}
                              onChange={() => handleDaySelection(index, 6)}
                              type="checkbox"
                            />
                            <p>6 days</p>
                          </div>
                          <div className="flex gap-2">
                            <Checkbox
                              checked={selectedDays[index] === 8}
                              onChange={() => handleDaySelection(index, 8)}
                              type="checkbox"
                            />
                            <p>8+ days</p>
                          </div>
                          <Button
                            disabled={!session?.user}
                            onClick={() =>
                              addCarToReserve(car, ChangeCarDayCount, setIsOpen)
                            }
                            className="w-full flex items-center mt-2 font-mono text-orange-900 font-bold text-2xl bg-yellow-200 border-none"
                          >
                            RESERVE
                            <p>{loadingStates[car._id] && <Spin />}</p>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <Button onClick={loadMoreData}>Load More</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
