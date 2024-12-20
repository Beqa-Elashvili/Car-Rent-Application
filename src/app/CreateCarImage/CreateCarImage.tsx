import { CarsType } from "../Providers/GlobalProvider/GlobalContext";

export const createCarImage = (car: CarsType, angle?: string) => {
  const url = new URL("https://cdn.imagin.studio/getimage");
  const { make, year, model } = car;
  url.searchParams.append("customer", "hrjavascript-mastery");
  url.searchParams.append("zoomType", "fullscreen");
  url.searchParams.append("paintdescription", "radiant-green");
  url.searchParams.append("modelFamily", model.split(" ")[0]);
  url.searchParams.append("make", make);
  url.searchParams.append("modelYear", `${year}`);
  url.searchParams.append("angle", `${angle}`);

  return `${url}`;
};
