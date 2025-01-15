export default function useHandleBrandImg() {
  const handleIcon = (name: string) => {
    switch (name) {
      case "Bmw":
        return "/BrandsLogos/BMW-M-Logo.png";
      case "Ferrari":
        return "/BrandsLogos/ferrari.png";
      case "Bugatti":
        return "/BrandsLogos/bugatt.png";
      case "Jaguar":
        return "/BrandsLogos/jaguar-Logo.png";
      case "Mercedes-Benz":
        return "/BrandsLogos/mercedes-benz.png";
      case "Audi":
        return "/BrandsLogos/audi.png";
      case "Lexus":
        return "/BrandsLogos/Lexus.png";
      case "Porsche":
        return "/BrandsLogos/porshce.png";
      case "Rolls-Royce":
        return "/BrandsLogos/rolls-royce.png";
      case "Bentley":
        return "/BrandsLogos/bentley.png";
      case "Aston Martin":
        return "/BrandsLogos/aston-martin.png";
      case "Maserati":
        return "/BrandsLogos/maserati.png";
      case "McLaren":
        return "/BrandsLogos/mclaren.png";
      case "Lamborghini":
        return "/BrandsLogos/Lamborghini.png";
      case "Tesla":
        return "/BrandsLogos/Tesla_logo.png";
    }
  };
  return { handleIcon };
}
