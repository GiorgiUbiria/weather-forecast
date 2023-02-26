import { useEffect, useState } from "react";

import DropDownComponent from "./DropDownComponent";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";

import "./header.module.css";

interface CityCoordinates {
  lat: number;
  lon: number;
}

const Header = ({ handleData }: any) => {
  const [forecastButtonClicked, setForecastButtonClicked] =
    useState<boolean>(false);
  const [dropDownClicked, setDropDownClicked] = useState<boolean>(false);
  const [dropDownVisible, setDropDownVisible] = useState<boolean>(false);
  const [cityName, setCityName] = useState<string>("");
  const [cityCoordinates, setCityCoordinates] = useState<CityCoordinates>();

  const handleDropDownClick = () => {
    dropDownClicked ? setDropDownClicked(false) : setDropDownClicked(true);
    dropDownClicked ? setDropDownVisible(true) : setDropDownVisible(false);
  };

  const handleCityNameChange = (city: string) => {
    setCityName(city);
  };

  const handleCityCoordinates = (coordinates: CityCoordinates) => {
    setCityCoordinates(coordinates);
  };

  const handleCityButtonClicked = (clicked: boolean) => {
    clicked ? setDropDownVisible(false) : setDropDownVisible(true);
    clicked ? setDropDownClicked(true) : setDropDownClicked(false);
    setForecastButtonClicked(false);
  };

  useEffect(() => {
    handleData(forecastButtonClicked, cityName, cityCoordinates);
  }, [cityName, cityCoordinates]);

  return (
    <>
      <div className="header">
        <h1 className="text-center text-6xl subpixel-antialiased font-medium tracking-wide mb-6 text-red-500">
          Weather Report!
        </h1>
      </div>

      <div className="weather-info w-64 flex justify-center">
        <div className="flex-col flex">
          <div className="flex-col flex">
            {cityName !== "" ? (
              <>
                <h1 className="text-white text-center text-3xl subpixel-antialiased font-medium">
                  {" "}
                  {cityName}{" "}
                  <button onClick={handleDropDownClick}>
                    {dropDownClicked ? (
                      <FontAwesomeIcon icon={faCaretUp} />
                    ) : (
                      <FontAwesomeIcon icon={faCaretDown} />
                    )}
                  </button>{" "}
                </h1>
              </>
            ) : (
              <>
                <h1 className="text-white text-center text-3xl subpixel-antialiased font-medium">
                  Choose a city{" "}
                  <button onClick={handleDropDownClick}>
                    {dropDownClicked ? (
                      <FontAwesomeIcon icon={faCaretUp} />
                    ) : (
                      <FontAwesomeIcon icon={faCaretDown} />
                    )}
                  </button>
                </h1>
              </>
            )}
          </div>

          <div>
            {!dropDownVisible && dropDownClicked && (
              <DropDownComponent
                handleCityName={handleCityNameChange}
                handleCityCoordinates={handleCityCoordinates}
                handleCityButtonClicked={handleCityButtonClicked}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
