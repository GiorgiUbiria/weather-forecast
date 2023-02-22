import { useEffect, useState } from "react";
import "./App.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";

import DropDownComponent from "./components/DropDownComponent";

const apiKey = import.meta.env.VITE_OPEN_WEATHER_KEY;

interface CityCoordinates {
  lat: number;
  lon: number;
}

function App() {
  const [forecastButtonClicked, setForecastButtonClicked] =
    useState<boolean>(false);
  const [dropDownClicked, setDropDownClicked] = useState<boolean>(false);
  const [dropDownVisible, setDropDownVisible] = useState<boolean>(false);
  const [cityName, setCityName] = useState<string>("");
  const [cityCoordinates, setCityCoordinates] = useState<CityCoordinates>();
  const [cityWeatherTemperature, setCityWeatherTemperature] = useState<any>({
    main: {},
  });
  const [cityWeatherGeneralInformation, setCityWeatherGeneralInformation] =
    useState<any>([
      {
        main: String,
        description: String,
      },
    ]);
  const [cityFourDayForecast, setCityFourDayForecast] = useState<any>({
    list: [{ main: String }],
  });

  const getCityWeatherInformationFromAPI = async (): Promise<void> => {
    const response = await (
      await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${cityCoordinates?.lat}&lon=${cityCoordinates?.lon}&appid=${apiKey}&units=metric`
      )
    ).json();

    setCityWeatherTemperature(response.main);
    setCityWeatherGeneralInformation(response.weather[0]);
  };

  const getCityFourDayWeatherForecastFromAPI = async (): Promise<void> => {
    const response = await (
      await fetch(
        `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${cityCoordinates?.lat}&lon=${cityCoordinates?.lon}&appid=${apiKey}&units=metric`
      )
    ).json();

    setCityFourDayForecast(response.list);
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
  };

  const handleDropDownClick = () => {
    dropDownClicked ? setDropDownClicked(false) : setDropDownClicked(true);
    dropDownClicked ? setDropDownVisible(true) : setDropDownVisible(false);
  };

  const handleShowForecastButton = () => {
    setForecastButtonClicked(true);
  };

  useEffect(() => {
    getCityWeatherInformationFromAPI();
  }, [cityCoordinates, cityName]);

  return (
    <div className="App flex items-center flex-col">
      <div className="header">
        <h1 className="text-center text-4xl subpixel-antialiased font-medium tracking-wide mb-6 text-red-500">
          Weather Report!
        </h1>
      </div>

      <div className="weather-info w-64 flex justify-center">
        <div className="flex-col flex mt-2">
          {cityName !== "" ? (
            <>
              <h1 className="text-white text-3xl subpixel-antialiased font-medium">
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
            <h1 className="text-white text-3xl subpixel-antialiased font-medium">
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
          <div>
            <h1 className="text-center text-white text-2xl subpixel-antialiased mt-2">
              {cityWeatherGeneralInformation?.main &&
                cityWeatherGeneralInformation?.main}
            </h1>
            <h1 className="text-center text-white text-2xl subpixel-antialiased">
              {cityWeatherTemperature?.temp &&
                Math.floor(cityWeatherTemperature?.temp) + "°C"}
            </h1>
          </div>
          {cityName !== "" ? (
            <button
              className="text-white text-3xl subpixel-antialiased font-medium border-2 rounded-md p-2 mt-5 hover:scale-105 flex justify-center items-center"
              onClick={handleShowForecastButton}
            >
              {" "}
              See 4-day Forecast{" "}
            </button>
          ) : null}
          <div>
            {forecastButtonClicked && (
              <>
                <h1 className="text-center text-white mt-4 text-2xl">
                  {" "}
                  4 day forecast:
                </h1>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
