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
} from "@fortawesome/free-solid-svg-icons";

import DropDownComponent from "./components/DropDownComponent";

const apiKey = import.meta.env.VITE_OPEN_WEATHER_KEY;

interface CityCoordinates {
  lat: number;
  lon: number;
}

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

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
  const [cityFiveDayForecast, setCityFiveDayForecast] = useState<any>([
    {
      main: {},
      weather: [{}],
    },
  ]);

  const getCityWeatherInformationFromAPI = async (): Promise<void> => {
    const response = await (
      await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${cityCoordinates?.lat}&lon=${cityCoordinates?.lon}&appid=${apiKey}&units=metric`
      )
    ).json();

    setCityWeatherTemperature(response?.main);
    setCityWeatherGeneralInformation(response?.weather[0]);
  };

  const getCityFiveDayWeatherForecastFromAPI = async (): Promise<void> => {
    const response = await (
      await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${cityCoordinates?.lat}&lon=${cityCoordinates?.lon}&appid=${apiKey}&units=metric`
      )
    ).json();

    let newArr = response.list.filter((value: any, index: number, Arr: any) => {
      return index % 8 == 0;
    });
    
    setCityFiveDayForecast(newArr);
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

  const handleDropDownClick = () => {
    dropDownClicked ? setDropDownClicked(false) : setDropDownClicked(true);
    dropDownClicked ? setDropDownVisible(true) : setDropDownVisible(false);
  };

  const handleShowForecastButton = () => {
    getCityFiveDayWeatherForecastFromAPI();
    setForecastButtonClicked(true);
  };

  const getNextFiveDays = () => {
    const today = new Date();
    const nextFiveDays = [];
    for (let i = 1; i <= 5; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      nextFiveDays.push(daysOfWeek[nextDay.getDay()]);
    }
    return nextFiveDays;
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
          <div>
            <h1 className="text-center text-white text-2xl subpixel-antialiased mt-2">
              {cityWeatherGeneralInformation?.main &&
              cityWeatherGeneralInformation?.main === "Rain" ? (
                <FontAwesomeIcon icon={faCloudRain} />
              ) : cityWeatherGeneralInformation?.main === "Clouds" ? (
                <FontAwesomeIcon icon={faCloud} />
              ) : cityWeatherGeneralInformation?.main === "Clear" ? (
                <FontAwesomeIcon icon={faSun} />
              ) : cityWeatherGeneralInformation?.main === "Snow" ? (
                <FontAwesomeIcon icon={faSnowflake} />
              ) : null}
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
              See 5-day Forecast{" "}
            </button>
          ) : null}
          <div>
            {forecastButtonClicked && (
              <>
                <h1 className="text-center text-white mt-4 text-2xl">
                  {" "}
                  5 day forecast:
                </h1>
                <div className="flex gap-6 justify-center mt-3">
                  {cityFiveDayForecast.map((data: any, index: number) => (
                    <div className="flex flex-col gap-2 justify-center">
                      <h4 className="text-white" key={data.main.id + "_head"}>
                        {getNextFiveDays()[index]}
                      </h4>
                      <h5
                        className="text-center text-white"
                        key={data.main.id + "_temp"}
                      >
                        {" "}
                        {Math.floor(data.main.temp)}
                        {"°C"}
                      </h5>
                      <h5
                        className="text-center text-white"
                        key={data.main.id + "_info"}
                      >
                        {data.weather[0].main === "Rain" ? (
                          <FontAwesomeIcon icon={faCloudRain} />
                        ) : data.weather[0].main === "Clouds" ? (
                          <FontAwesomeIcon icon={faCloud} />
                        ) : data.weather[0].main === "Clear" ? (
                          <FontAwesomeIcon icon={faSun} />
                        ) : data.weather[0].main === "Snow" ? (
                          <FontAwesomeIcon icon={faSnowflake} />
                        ) : null}
                      </h5>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
