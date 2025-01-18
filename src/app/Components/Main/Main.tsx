import { motion } from "framer-motion";
import { Input, Button, Spin, Form, Select, Skeleton } from "antd";
import Image from "next/image";
import { Carousel, Grid } from "antd";
import { useGlobalProvider } from "@/app/Providers/GlobalProvider";
import {
  CarsType,
  TcarsModels,
  TCollecttion,
  TFormtype,
} from "@/app/Providers/GlobalProvider/GlobalContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function Main() {
  const { carData, collections, loading, carsModels } = useGlobalProvider();
  const router = useRouter();
  const [form] = Form.useForm();

  const screens = Grid.useBreakpoint();

  // Determine the number of slides to show based on the screen size
  let slidesToShow = 1; // Default for small screens
  if (screens.md) {
    slidesToShow = 3; // Show 3 slides on medium screens
  }
  if (screens.xl) {
    slidesToShow = 5; // Show 5 slides on extra large screens
  }

  const GetCarModel = (model: string) => {
    router.push(`/pages/brands/All/${model}/All`);
  };

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

  const [brand, setBrand] = useState<string>("");
  const [model, setModel] = useState<string | undefined>("");
  const [carClass, setCarClass] = useState<string | undefined>("");

  const [chosenModels, setChosenModels] = useState<string[]>([]);
  const [chosenClass, setChosenClass] = useState<string[]>([]);

  const FilteredModels = (brand: string, model: string) => {
    const CarsModels = carData?.filter(
      (item, index, self) =>
        item.brand === brand &&
        self.findIndex((car) => car.model === item.model) === index
    );
    setChosenModels(CarsModels.map((item: CarsType) => item.model));

    const CarsClass = carData?.filter(
      (item, index, self) =>
        self.findIndex(
          (car) =>
            car.brand === brand &&
            (model ? car.model === model : true) &&
            car.class === item.class
        ) === index
    );
    setChosenClass(CarsClass.map((item: CarsType) => item.class));
  };

  useEffect(() => {
    FilteredModels(brand, (model && model) || "");
  }, [brand, model]);

  const ClearModelsAndClases = () => {
    form.resetFields();
    setCarClass(undefined);
    setModel(undefined);
    setChosenModels([]);
    setChosenClass([]);
  };

  const [quete, setQuete] = useState({
    Name: "",
    Email: "",
    Phonenumber: "",
    Brand: "Brand",
  });

  const handleQuoteValues = (key: string, value: string) => {
    setQuete((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const ClearQuete = () => {
    setQuete({
      Name: "",
      Email: "",
      Phonenumber: "",
      Brand: "",
    });
  };

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
        <div className="absolute flex items-center justify-between h-full p-12 md:p-20 inset-0">
          <motion.h1
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            transition={{ duration: 1 }}
            className="text-xl md:text-4xl lg:text-6xl xl:text-6xl w-1/2 font-medium text-white "
          >
            Luxury Cars For your Confort
          </motion.h1>
          <Button
            onClick={() => router.push("/pages/brands/Porsche/All/All")}
            className="p-2 md:p-14 lg:p-20 text-white text-sm rounded-full bg-cyan-500 h-20 w-20"
          >
            EXPLORE
          </Button>
        </div>
      </div>
      {loading && (
        <div className="p-20 text-center">
          <div className="block md:hidden text-center">
            <Skeleton.Image active className="w-full h-60 rounded-t-x" />
          </div>
          <div className="hidden md:flex lg:hidden items-center justify-between">
            <Skeleton.Image active className="w-full h-48" />
            <Skeleton.Image active className="w-full h-48" />
            <Skeleton.Image active className="w-full h-48" />
          </div>
          <div className=" hidden lg:flex items-center justify-between">
            <div>
              <Skeleton.Image active className="w-full h-48" />
            </div>
            <div>
              <Skeleton.Image active className="w-full h-48" />
            </div>{" "}
            <div>
              <Skeleton.Image active className="w-full h-48" />
            </div>{" "}
            <div>
              <Skeleton.Image active className="w-full h-48" />
            </div>{" "}
            <div>
              <Skeleton.Image active className="w-full h-48" />
              <Skeleton.Input active />
            </div>
          </div>
        </div>
      )}
      <Carousel
        slidesToShow={slidesToShow}
        arrows
        autoplay
        className="p-4"
        dotPosition="bottom"
        infinite={true}
      >
        {carData?.map((item: CarsType) => {
          return (
            <div
              onClick={() => router.push(`/pages/solocar/${item._id}`)}
              className="p-2 w-full cursor-pointer rounded-xl transition duration-300 hover:scale-105 overflow-hidden"
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
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="p-2 bg-orange-900 flex items-center justify-between md:block text-orange-200 rounded-b-xl">
                <div className="block flex-col items-center justify-center md:flex font-mono md:justify-center text-balance gap-2">
                  <h1 className="text-xl font-semibold">{item.make}</h1>
                  <h1 className="text-xl font-semibold">{item.model}</h1>
                </div>
                <h1 className="block md:hidden font-mono text-xl">
                  {item.dayPrice} $
                </h1>
                <div className="mt-4 hidden md:flex font-serif text-xl justify-between">
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
            className="text-orange-300 text-3xl md:text-8xl"
          >
            Find Your Best
          </motion.h1>
          <motion.button
            onClick={() => router.push(`/pages/collection`)}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 200 }}
            transition={{ duration: 1 }}
            className=" text-xl md:text-3xl hover:bg-orange-600  p-2 px-6 rounded-full bg-orange-500"
          >
            EXPLORE
          </motion.button>
        </div>
      </div>
      <div className="text-white text-center md:text-start w-full">
        <div className="p-4 md:py-20 md:flex justify-between ">
          <div className="flex flex-col items-center md:items-start gap-20">
            <h1 className="text-orange-900">RENTAL CARS</h1>
            <p className="w-3/4 text-6xl text-orange-900 ">
              Experience is everything
            </p>
          </div>
          <p className=" w-full p-4 md:p-0 md:w-2/6 text-orange-900 flex items-end">
            Whether you're looking to elevate your business transportation,
            seeking a wedding getaway car, or are just ready to have an
            exhilarating experience, there is no better answer than Rental Cars.
          </p>
        </div>

        <div className="inlne font-serif relative">
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
              className="text-3xl md:text-8xl text-orange-300"
            >
              Rest with Porsche
            </motion.h1>
            <motion.button
              onClick={() => router.push("/pages/brands/Porsche/All/All")}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 200 }}
              transition={{ duration: 1 }}
              className="text-xl md:text-3xl text-black hover:bg-orange-600  p-2 px-6 rounded-full bg-orange-500"
            >
              EXPLORE
            </motion.button>
          </div>
          <div className="absolute inset-0 h-12 md:h-96 bg-gradient-to-t from-transparent to-black"></div>
          <div className="absolute bottom-0 left-0 right-0 h-20 md:h-80 bg-gradient-to-t from-black to-transparent opacity-90 "></div>
        </div>
        <div className="relative ">
          <Image
            width={2000}
            height={2000}
            className="w-full"
            alt="image"
            src={"/carcollections.jpeg"}
          />
          <div className="absolute backdrop-blur-md rounded-xl w-10/12 md:w-1/2 h-48 md:h-4/5 lg:h-3/6 m-auto bg-cyan-200 bg-opacity-10 inset-0 flex items-center justify-center">
            <Form<TFormtype>
              form={form}
              className="flex flex-col gap-0 md:gap-2"
              onFinish={onFinish}
            >
              <h1 className="font-serif text-orange-600 w-78 text-xl md:text-4xl">
                Discover new opportunities
              </h1>
              <Form.Item
                name="brand"
                className="h-2 md:h-full"
                rules={[{ required: true, message: "Please input a value!" }]}
              >
                <Select
                  value={brand}
                  className="h-6 md:h-full"
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

              <Form.Item className="h-2  md:h-full" name="model">
                <Select
                  value={model}
                  className="h-6  md:h-full"
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
              <Form.Item className="h-2  md:h-full" name="class">
                <Select
                  value={carClass}
                  className="h-6  md:h-full"
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

              <Button className="h-6  md:h-full" onClick={ClearModelsAndClases}>
                Clear
              </Button>
              <Button
                className="h-6 md:h-full mt-1"
                type="primary"
                htmlType="submit"
              >
                Search
              </Button>
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
              <div className="relative hover:text-gray-200 h-44 w-10/12 flex flex-col overflow-hidden justify-center m-auto">
                <motion.div
                  whileInView={{ opacity: 1, x: 0 }}
                  initial={{ opacity: 0, x: -100 }}
                  transition={{ duration: 1 }}
                  className="text-9xl  md:text-[220px] absolute"
                >
                  <item.img className="opacity-40" />
                </motion.div>
                <motion.h1
                  whileInView={{ opacity: 1, x: 0 }}
                  initial={{ opacity: 0, x: 100 }}
                  transition={{ duration: 1 }}
                  className="ml-20 text-5xl md:text-[100px] lg:text-[120px]  md:ml-36"
                >
                  {item.name}
                </motion.h1>
              </div>
              <div className="h-px bg-gray-700 w-full"></div>
            </div>
          ))}
        </div>
        <div className="h-px bg-gray-900 w-full mt-40"></div>
        <div className="relative h-96 bg-orange-900 ">
          <div className="absolute inset-0 h-96 bg-gradient-to-t to-black from-transparent opacity-90 ">
            <div className="w-3/4 py-12 m-auto">
              <h1 className=" text-3xl md:text-6xl">Get a quote</h1>
              <div className="grid grid-cols-2 items-center mt-12 gap-8">
                <Input
                  name="Name"
                  value={quete.Name}
                  onChange={(e) => handleQuoteValues("Name", e.target.value)}
                  placeholder="Name"
                  className="p-2 rounded-xl placeholder-white text-white  bg-gray-400 focus:bg-gray-400 hover:bg-gray-400 border-none focus:outline-none "
                />
                <Input
                  name="PhoneNumber"
                  value={quete.Phonenumber}
                  onChange={(e) =>
                    handleQuoteValues("Phonenumber", e.target.value)
                  }
                  placeholder="PhoneNumber"
                  className="p-2 rounded-xl placeholder-white text-white  bg-gray-400 focus:bg-gray-400 hover:bg-gray-400 border-none focus:outline-none "
                />
                <Input
                  name="Email"
                  value={quete.Email}
                  onChange={(e) => handleQuoteValues("Email", e.target.value)}
                  placeholder="Email"
                  className="p-2 rounded-xl placeholder-white text-white  bg-gray-400 focus:bg-gray-400 hover:bg-gray-400 border-none focus:outline-none "
                />
                <Select
                  value={quete.Brand}
                  onChange={(value) => handleQuoteValues("Brand", value)}
                  defaultValue={"Car"}
                  placeholder="Car"
                >
                  {collections?.map((item: TCollecttion) => (
                    <Select.Option
                      key={item.img}
                      className="text-black rounded bg-white"
                      value={item.name}
                    >
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <Button
                onClick={ClearQuete}
                className="mt-4 w-40 border-none font-medium"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
