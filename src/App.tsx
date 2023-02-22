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
  };

  const handleDropDownClick = () => {
    dropDownClicked ? setDropDownClicked(false) : setDropDownClicked(true);
    dropDownClicked ? setDropDownVisible(true) : setDropDownVisible(false);
  };

  const handleShowForecastButton = () => {
    getCityFiveDayWeatherForecastFromAPI();
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
                  {cityFiveDayForecast.map((data: any, key: number) => (
                    <div className="flex flex-col gap-2 justify-center">
                      <h4 className="text-white" key={data.main.id + "_head"}>
                        Get the current day and show for next 5 days
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
                        {" "}
                        {data.weather[0].main}
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
