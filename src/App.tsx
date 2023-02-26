import { useEffect, useState } from "react";
import "./App.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faCaretUp,
  faCloudRain,
  faSun,
  faCloud,
  faSnowflake,
  faWind,
} from "@fortawesome/free-solid-svg-icons";

import DropDownComponent from "./components/DropDownComponent";
import WeatherInfo from "./components/WeatherInfo";
import FiveDayForecast from "./components/FiveDayForecast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const apiKey = import.meta.env.VITE_OPEN_WEATHER_KEY;

interface CityCoordinates {
  lat: number;
  lon: number;
}

const queryClient = new QueryClient();

function App() {
  const [forecastButtonClicked, setForecastButtonClicked] =
    useState<boolean>(false);
  const [dropDownClicked, setDropDownClicked] = useState<boolean>(false);
  const [dropDownVisible, setDropDownVisible] = useState<boolean>(false);
  const [cityName, setCityName] = useState<string>("");
  const [cityCoordinates, setCityCoordinates] = useState<CityCoordinates>();

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

  const handleDropDownClick = () => {
    dropDownClicked ? setDropDownClicked(false) : setDropDownClicked(true);
    dropDownClicked ? setDropDownVisible(true) : setDropDownVisible(false);
  };

  const handleShowForecastButton = () => {
    setForecastButtonClicked(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App flex items-center flex-col">
        <div className="header">
          <h1 className="text-center text-6xl subpixel-antialiased font-medium tracking-wide mb-6 text-red-500">
            Weather Report!
          </h1>
        </div>

        <div className="weather-info w-64 flex justify-center">
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
            )}
            <div>
              {!dropDownVisible && dropDownClicked && (
                <DropDownComponent
                  handleCityName={handleCityNameChange}
                  handleCityCoordinates={handleCityCoordinates}
                  handleCityButtonClicked={handleCityButtonClicked}
                />
              )}
            </div>
            <WeatherInfo cityCoordinates={cityCoordinates} apiKey={apiKey} />
            <div className="flex justify-center">
              {cityName !== "" ? (
                <button
                  className="text-white text-3xl subpixel-antialiased font-medium border-2 rounded-md p-2 mt-5 hover:scale-105 w-96"
                  onClick={handleShowForecastButton}
                >
                  {" "}
                  See 5-day Forecast{" "}
                </button>
              ) : null}
            </div>
            {forecastButtonClicked && (
              <FiveDayForecast
                cityCoordinates={cityCoordinates}
                apiKey={apiKey}
              />
            )}
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
