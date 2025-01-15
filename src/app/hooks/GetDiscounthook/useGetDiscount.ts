export default function useGetUpdatedPrice() {
  const getUpdatedPrice = (dayPrice: number, days: number) => {
    let discount = 0;
    let updatedPrice = dayPrice;

    switch (true) {
      case days >= 8:
        discount = dayPrice * 0.4;
        updatedPrice = dayPrice * 0.6;
        break;

      case days >= 6:
        discount = dayPrice * 0.3;
        updatedPrice = dayPrice * 0.7;
        break;

      case days >= 4:
        discount = dayPrice * 0.2;
        updatedPrice = dayPrice * 0.8;
        break;

      case days >= 2:
        discount = dayPrice * 0.1;
        updatedPrice = dayPrice * 0.9;
        break;

      default:
        discount = 0;
        updatedPrice = dayPrice;
    }
    const discountPercentage = discount ? (discount / dayPrice) * 100 : 0;
    return { updatedPrice, discountPercentage };
  };
  return { getUpdatedPrice };
}
