import { useEffect, useState } from "react";

import DropDownComponent from "./DropDownComponent";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";

import useAppBadge from "../hooks/useAppBadge";

import "./header.module.css";

const geoCage = import.meta.env.VITE_GEO_CAGE_KEY;
const apiKey = import.meta.env.VITE_OPEN_WEATHER_KEY;
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
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [cityCoordinates, setCityCoordinates] = useState<CityCoordinates>();
  const [setBadge, clearBadge, setTemperature] = useAppBadge();

  const handleDropDownClick = () => {
    dropDownClicked ? setDropDownClicked(false) : setDropDownClicked(true);
    dropDownClicked ? setDropDownVisible(true) : setDropDownVisible(false);
    setForecastButtonClicked(true);
  };

  const handleCityNameChange = (city: string) => {
    setCityName(city);
    setInitialLoad(false);
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
    if (initialLoad && cityName === "") {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userCoordinates: CityCoordinates = {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            };
            setCityCoordinates(userCoordinates);
            fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${userCoordinates.lat}+${userCoordinates.lon}&key=${geoCage}`
            )
              .then((response) => response.json())
              .then((data) => {
                const city = data.results[0].components.city;
                fetch(
                  `https://api.openweathermap.org/data/2.5/weather?lat=${userCoordinates.lat}&lon=${userCoordinates?.lon}&appid=${apiKey}&units=metric`
                ).then((response) => response.json())
                  .then((data) => {
                    setTemperature(data?.main?.temp);
                  })
                setCityName(city);
                setInitialLoad(false);
                setBadge();
              })
              .catch((error) => {
                console.error("Error reverse geocoding:", error);
                clearBadge();
              });
          },
          (error) => {
            console.error("Error getting user coordinates:", error);
            clearBadge();
          }
        );
      } else {
        console.error("Geolocation is not supported in this browser.");
        clearBadge();
      }
    }
  }, [initialLoad, cityName]);

  useEffect(() => {
    handleData(forecastButtonClicked, cityName, cityCoordinates, initialLoad);
  }, [cityName, cityCoordinates, initialLoad]);

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
            {cityName !== "" || initialLoad !== true ? (
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
