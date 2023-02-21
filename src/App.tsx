import { useState } from "react";
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
  const [dropDownClicked, setDropDownClicked] = useState<boolean>(false);
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

  const getCoordinatesOfTheCityFromAPI = async (
    city: string
  ): Promise<void> => {
    const response = await (
      await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`
      )
    ).json();

    const { lat, lon } = response[0];

    setCityCoordinates({ lat, lon });
  };

  const getCityWeatherTemperatureFromAPI = async (): Promise<void> => {
    const response = await (
      await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${cityCoordinates?.lat}&lon=${cityCoordinates?.lon}&appid=${apiKey}&units=metric`
      )
    ).json();

    setCityWeatherTemperature(response.main);
  };

  const getCityWeatherGeneralInformationFromAPI = async (): Promise<void> => {
    const response = await (
      await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${cityCoordinates?.lat}&lon=${cityCoordinates?.lon}&appid=${apiKey}`
      )
    ).json();

    setCityWeatherGeneralInformation(response.weather[0]);
  };

  const handleDropDownClick = () => {
    dropDownClicked ? setDropDownClicked(false) : setDropDownClicked(true);
  };

  const handleCityNameChange = (city: string) => {
    setCityName(city);
  };

  console.log(cityName);

  return (
    <div className="App flex items-center flex-col bg-black">
      <div className="header">
        <h1 className="text-center text-white text-4xl subpixel-antialiased font-medium tracking-wide mb-6">
          Weather Report!
        </h1>
      </div>

      <div className="weather-info border-solid border-2 w-64 bg-black flex justify-center">
        <div className="flex-col flex">
          {cityName !== "" ? (
            <h1 className="text-white">
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
          ) : (
            <h1 className="text-white">
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
            {dropDownClicked && (
              <DropDownComponent handleCity={handleCityNameChange} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
