import { motion } from "framer-motion";
import { Input, Button, Spin, Form, Select } from "antd";
import Image from "next/image";
import { Carousel } from "antd";
import { useGlobalProvider } from "@/app/Providers/GlobalProvider";
import {
  CarsType,
  TcarsModels,
  TCollecttion,
} from "@/app/Providers/GlobalProvider/GlobalContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function Main() {
  const {
    carData,
    setCarData,
    collections,
    loading,
    setLoading,
    setError,
    carsModels,
  } = useGlobalProvider();
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const resp = await axios.get("/api/cars");
        setCarData(resp.data.cars);
      } catch (error: unknown) {
        setError(null);
      } finally {
        setLoading(false);
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  const GetCarModel = (model: string) => {
    router.push(`/pages/brands/All/${model}/All`);
  };

  const onFinish = (values: string[]) => {
    console.log("Form values:", values);
  };
  const [brand, setBrand] = useState<string>("");

  const FilteredModels = (brand: string) => {
    const CarsModels = carData?.filter(
      (item, index, self) =>
        item.brand === brand &&
        self.findIndex((car) => car.model === item.model) === index
    );
    setChosenModels(CarsModels);
  };

  useEffect(() => {
    FilteredModels(brand);
  }, [brand]);

  const [chosenModels, setChosenModels] = useState<CarsType[]>([]);
  const [chosenClass, setChosenClass] = useState<CarsType[]>([]);

  const [model, setModel] = useState<string>("");
  const [carClass, setCarClass] = useState<string>("");

  return (
    <div className="bg-orange-500 h-full">
      <div className="relative">
        <Image
          alt="porche"
          quality={100}
          width={2000}
          height={2000}
          unoptimized
          src="/porche1.jpg"
        />
        <div className="absolute flex items-center justify-between h-full p-20 inset-0">
          <motion.h1
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            transition={{ duration: 1 }}
            className="text-8xl w-1/2 font-medium text-white "
          >
            Luxury Cars For your Confort
          </motion.h1>
          <Button
            onClick={() => router.push("/pages/brands/Porsche/All")}
            className="p-20 text-white text-xl rounded-full bg-cyan-500 h-20 w-20"
          >
            EXPLORE
          </Button>
        </div>
      </div>
      {loading && (
        <h1 className="text-center w-full text-white text-3xl mt-4">
          please wait <Spin />
        </h1>
      )}
      <Carousel
        slidesToShow={5}
        arrows
        autoplay
        className="p-20"
        dotPosition="bottom"
        infinite={true}
      >
        {carData?.map((item: CarsType) => {
          return (
            <div
              onClick={() => router.push(`/pages/solocar/${item._id}`)}
              className="p-2 w-full cursor-pointer rounded-xl hover:bg-orange-300"
              key={item._id}
            >
              <div className="relative min-h-60 rounded-t-xl overflow-hidden">
                <div
                  className="absolute inset-0 w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url('/industrialwebp.jpg')` }}
                >
                  <img
                    src={item.img}
                    alt="carImg"
                    className="w-full h-full object-contain "
                  />
                </div>
              </div>
              <div className="p-2 bg-orange-900 text-orange-200 rounded-b-xl">
                <div className="flex justify-center font-mono text-balance gap-2">
                  <h1 className="text-xl font-semibold">{item.make}</h1>
                  <h1 className="text-xl font-semibold">{item.model}</h1>
                </div>
                <div className="mt-4 flex font-serif text-xl justify-between">
                  <p>{item.horsepower} HP</p>
                  {"|"}
                  <p>{item.combination_mpg}L</p>
                  {"|"}
                  <p>$ {item.dayPrice}/Day</p>
                </div>
              </div>
            </div>
          );
        })}
      </Carousel>
      <div className="bg-gray-500 h-px w-full my-8"></div>
      <h1 className="px-20 text-orange-900 text-3xl">
        Explore the BMW comfort
      </h1>
      <Carousel
        slidesToShow={3}
        arrows
        autoplay
        className="p-20"
        dotPosition="bottom"
        infinite={true}
      >
        {carData
          .filter((item: CarsType) => item.brand === "Bmw")
          .map((item) => {
            return (
              <div
                onClick={() => router.push(`/pages/solocar/${item._id}`)}
                className="p-2 w-full cursor-pointer rounded-xl hover:bg-orange-300"
                key={item._id}
              >
                <div className="relative min-h-60 rounded-t-xl overflow-hidden">
                  <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url('/industrialwebp.jpg')` }}
                  >
                    <img
                      src={item.img}
                      alt="Img"
                      className="w-full h-full object-contain "
                    />
                  </div>
                </div>
                <div className="p-2 bg-orange-900 text-orange-200 rounded-b-xl">
                  <div className="flex justify-center font-mono text-balance gap-2">
                    <h1 className="text-xl font-semibold">{item.make}</h1>
                    <h1 className="text-xl font-semibold">{item.model}</h1>
                  </div>
                  <div className="mt-4 flex text-xl font-serif justify-between">
                    <p>{item.horsepower} HP</p>
                    {"|"}
                    <p>{item.combination_mpg}L</p>
                    {"|"}
                    <p>$ {item.dayPrice}/Day</p>
                  </div>
                </div>
              </div>
            );
          })}
      </Carousel>
      <div className="py-2 relative ">
        <Image
          alt="image"
          width={2000}
          height={2000}
          className="w-full"
          src={"/mph_club.png"}
        />
        <div className="font-serif absolute inset-0 flex flex-col items-center justify-center">
          <motion.h1
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: -200 }}
            transition={{ duration: 1 }}
            className="text-orange-300 text-8xl"
          >
            Find Your Best
          </motion.h1>
          <motion.button
            onClick={() => router.push(`/pages/collection`)}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 200 }}
            transition={{ duration: 1 }}
            className="text-3xl hover:bg-orange-600  p-2 px-6 rounded-full bg-orange-500"
          >
            EXPLORE
          </motion.button>
        </div>
      </div>
      <div className="text-white w-full">
        <div className="p-4 py-20 flex justify-between ">
          <div className="flex flex-col gap-20">
            <h1 className="text-orange-900">RENTAL CARS</h1>
            <p className="w-3/4 text-6xl text-orange-900 ">
              Experience is everything
            </p>
          </div>
          <p className="w-2/6 text-orange-900 flex items-end">
            Whether you're looking to elevate your business transportation,
            seeking a wedding getaway car, or are just ready to have an
            exhilarating experience, there is no better answer than Rental Cars.
          </p>
        </div>

        <div className="inline font-serif relative">
          <Image
            width={1000}
            height={300}
            className="object-contain w-full"
            src="/porche.jpg"
            alt="carImg"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.h1
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: -200 }}
              transition={{ duration: 1 }}
              className="text-8xl text-orange-300"
            >
              Rest with Porsche
            </motion.h1>
            <motion.button
              onClick={() => router.push("/pages/brands/Porsche/All/All")}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 200 }}
              transition={{ duration: 1 }}
              className="text-3xl text-black hover:bg-orange-600  p-2 px-6 rounded-full bg-orange-500"
            >
              EXPLORE
            </motion.button>
          </div>
          <div className="absolute inset-0 h-96 bg-gradient-to-t from-transparent to-black"></div>
          <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-black to-transparent opacity-90 "></div>
        </div>
        <div className="relative ">
          <Image
            width={2000}
            height={2000}
            className="w-full"
            alt="image"
            src={"/carcollections.jpeg"}
          />
          <div className="absolute backdrop-blur-md rounded-xl w-1/2 h-1/2 m-auto bg-cyan-200 bg-opacity-10 inset-0 flex items-center justify-center">
            <Form layout="horizontal" onFinish={onFinish}>
              <Form.Item
                name="brand"
                rules={[{ required: true, message: "Please input a value!" }]}
              >
                <Select
                  onChange={(e) => setBrand(e)}
                  placeholder="Select an brand"
                >
                  {collections?.map((item: TCollecttion, index: number) => (
                    <Select.Option key={index} value={item.name}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="model"
                rules={[
                  { required: true, message: "Please select an option!" },
                ]}
              >
                <Select
                  onChange={(e) => setModel(e)}
                  placeholder="Select an model"
                >
                  {chosenModels?.map((item: CarsType) => (
                    <Select.Option key={item._id} value={item.model}>
                      {item.model}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="class"
                rules={[
                  { required: true, message: "Please select an option!" },
                ]}
              >
                <Select
                  onChange={(e) => setCarClass(e)}
                  placeholder="Select an class"
                >
                  {chosenClass?.map((item: CarsType) => (
                    <Select.Option key={item._id} value={item.class}>
                      {item.class}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
        <div className="text-9xl font-medium ">
          {carsModels.map((item: TcarsModels, index: number) => (
            <div
              key={index}
              className="cursor-pointer"
              onClick={() => GetCarModel(item.name)}
            >
              <div className="relative hover:text-gray-400 h-44 w-10/12 flex flex-col overflow-hidden justify-center m-auto">
                <motion.div
                  whileInView={{ opacity: 1, x: 0 }}
                  initial={{ opacity: 0, x: -100 }}
                  transition={{ duration: 1 }}
                  className="text-[220px] absolute"
                >
                  <item.img className="opacity-40" />
                </motion.div>
                <motion.h1
                  whileInView={{ opacity: 1, x: 0 }}
                  initial={{ opacity: 0, x: 100 }}
                  transition={{ duration: 1 }}
                  className="ml-36"
                >
                  {item.name}
                </motion.h1>
              </div>
              <div className="h-px bg-gray-700 w-full"></div>
            </div>
          ))}
        </div>
        <div className="h-40"></div>
        <div className="h-px bg-gray-900 w-full"></div>
        <div className="relative h-96 bg-green-900 ">
          <div className="absolute inset-0 h-96 bg-gradient-to-t to-black from-transparent opacity-90 ">
            <div className="w-3/4 py-12 m-auto">
              <h1 className="text-6xl">Get a quote</h1>
              <div className="grid grid-cols-2 items-center mt-12 gap-8">
                <Input
                  placeholder="Name"
                  className="p-2 rounded-xl placeholder-white text-white  bg-gray-400 focus:bg-gray-400 hover:bg-gray-400 border-none focus:outline-none "
                />
                <Input
                  placeholder="Phone"
                  className="p-2 rounded-xl placeholder-white text-white  bg-gray-400 focus:bg-gray-400 hover:bg-gray-400 border-none focus:outline-none "
                />
                <Input
                  placeholder="Email"
                  className="p-2 rounded-xl placeholder-white text-white  bg-gray-400 focus:bg-gray-400 hover:bg-gray-400 border-none focus:outline-none "
                />
                <Select
                  defaultValue={""}
                  className="p-2 rounded-xl bg-gray-400 text-white focus:outline-none"
                >
                  <Select.Option
                    className="text-black rounded bg-white"
                    disabled
                    value=""
                  >
                    Car
                  </Select.Option>
                  <Select.Option
                    className="text-black rounded bg-white"
                    value="Porche"
                  >
                    Porche
                  </Select.Option>
                  <Select.Option
                    className="text-black rounded bg-white"
                    value="Lamborghini"
                  >
                    Lamborghini
                  </Select.Option>
                  <Select.Option
                    className="text-black rounded bg-white"
                    value="Bmw"
                  >
                    Bmw
                  </Select.Option>
                  <Select.Option
                    className="text-black rounded bg-white"
                    value="McLaren"
                  >
                    McLaren
                  </Select.Option>
                  <Select.Option
                    className="text-black rounded bg-white"
                    value="Mercedes"
                  >
                    Mercedes
                  </Select.Option>
                </Select>
              </div>
              <Button className="bg-blue-500 text-xl mt-4 w-40 border-none text-white font-medium">
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
