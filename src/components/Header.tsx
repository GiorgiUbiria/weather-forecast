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
        <h1 className="text-center subpixel-antialiased font-medium tracking-wide text-red-500 text-2xl md:text-6xl md:mb-6 sm:text-4xl sm:mb-3">
          Weather Report!
        </h1>
      </div>

      <div className="weather-info w-64 flex justify-center">
        <div className="flex-col flex">
          <div className="flex-col flex">
            {cityName !== "" ? (
              <>
                <h1 className="text-white text-2xl text-center subpixel-antialiased font-medium md:text-3xl">
                  {" "}
                  {cityName}{" "}
                  <button
                    onClick={handleDropDownClick}
                    aria-label={dropDownClicked ? 'Collapse dropdown' : 'Expand dropdown'}
                    role="button"
                  >
                    {dropDownClicked ? (
                      <FontAwesomeIcon icon={faCaretUp} />
                    ) : (
                      <FontAwesomeIcon icon={faCaretDown} />
                    )}
                  </button>
                </h1>
              </>
            ) : (
              <>
                <h1 className="text-white text-center text-2xl subpixel-antialiased font-medium md:text-3xl">
                  Choose a city{" "}
                  <button 
                    onClick={handleDropDownClick}
                    aria-label={dropDownClicked ? 'Collapse dropdown' : 'Expand dropdown'}
                    role="button"
                  >
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
