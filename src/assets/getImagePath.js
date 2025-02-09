import smartphoneImage from "../assets/mobile.svg";
import jeansImage from "../assets/jeans.svg";

import coffee from "../assets/coffee.svg";
import textileBag from "../assets/bag.svg";
import busImage from "../assets/bus.svg";
import carImage from "../assets/car.svg";
import flightImage from "../assets/flight.svg";
import meatImage from "../assets/meat.svg";
import vegoImage from "../assets/vegetarian.svg";
import sneakersImage from "../assets/sneakers.svg";
import tShirtImage from "../assets/t-shirt.svg";
import trainImage from "../assets/train.svg";
import defaultImage from "../assets/qmark.svg";

const getImagePath = (img) => {
  switch (img) {
    case "../assets/smartphone.svg":
      return smartphoneImage;
    case "../assets/jeans.svg":
      return jeansImage;
    case "../assets/bus.svg":
      return busImage;
    case "../assets/car.svg":
      return carImage;
    case "../assets/flight.svg":
      return flightImage;
    case "../assets/sneakers.svg":
      return sneakersImage;
    case "../assets/meat.svg":
      return meatImage;
    case "../assets/vegetarian.svg":
      return vegoImage;
    case "../assets/train.svg":
      return trainImage;
    case "../assets/t-shirt.svg":
      return tShirtImage;
    case "../assets/coffee.svg":
      return coffee;
    case "../assets/bag.svg":
      return textileBag;
    default:
      return defaultImage;
  }
};

export { getImagePath };