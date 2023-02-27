import { useEffect, useState, useCallback } from "react";
import Particles from "react-particles";
import { loadFull } from "tsparticles";
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

function mps_to_kmph(mps: number) {
  return 3.6 * mps;
}

function App() {
  const [forecastButtonClicked, setForecastButtonClicked] =
    useState<boolean>(false);
  const [dropDownClicked, setDropDownClicked] = useState<boolean>(false);
  const [dropDownVisible, setDropDownVisible] = useState<boolean>(false);
  const [cityName, setCityName] = useState<string>("");
  const [cityCoordinates, setCityCoordinates] = useState<CityCoordinates>();
  const [cityWindSpeed, setCityWindSpeed] = useState<any>({
    wind: {},
  });
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
      wind: {},
    },
  ]);

  const options = {
    particles: {
      number: {
        value: 30,
        density: {
          enable: true,
          area: 1500,
        },
      },
      color: {
        value: ["#2EB67D", "#ECB22E", "#E01E5B", "#36C5F0"],
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: 0.8,
      },
      size: {
        value: { min: 1, max: 6 },
      },
      links: {
        enable: true,
        distance: 150,
        color: "#808080",
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 3,
        direction: "none",
        random: false,
        straight: false,
        outModes: "out",
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "grab",
        },
        onClick: {
          enable: true,
          mode: "push",
        },
      },
      modes: {
        grab: {
          distance: 140,
          links: {
            opacity: 1,
          },
        },
        push: {
          quantity: 4,
        },
      },
    },
  };

  const particlesInit = useCallback(async (engine: any) => {
    await loadFull(engine);
  }, []);

  const getCityWeatherInformationFromAPI = async (): Promise<any> => {
    const response = await (
      await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${cityCoordinates?.lat}&lon=${cityCoordinates?.lon}&appid=${apiKey}&units=metric`
      )
    ).json();

    setCityWeatherTemperature(response?.main);
    setCityWindSpeed(response?.wind);
    setCityWeatherGeneralInformation(response?.weather[0]);
  };

  const getCityFiveDayWeatherForecastFromAPI = async (): Promise<any> => {
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
    getCityFiveDayWeatherForecastFromAPI();
  }, [cityCoordinates, cityName]);

  return (
    <div className="App flex items-center flex-col">
      <Particles options={options} init={particlesInit} />
      <div className="header">
        <h1 className="text-center text-4xl subpixel-antialiased font-medium tracking-wide mb-6 text-red-500">
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
          <div className="flex flex-col gap-2">
            <h1 className="text-center text-white text-2xl subpixel-antialiased mt-2">
              {cityWeatherGeneralInformation?.main &&
              cityWeatherGeneralInformation?.main === "Rain" ? (
                <FontAwesomeIcon
                  icon={faCloudRain}
                  className="icon-rain"
                  style={{ fontSize: "64px" }}
                />
              ) : cityWeatherGeneralInformation?.main === "Clouds" ? (
                <FontAwesomeIcon
                  icon={faCloud}
                  className="icon-cloud"
                  style={{ fontSize: "64px" }}
                />
              ) : cityWeatherGeneralInformation?.main === "Clear" ? (
                <FontAwesomeIcon
                  icon={faSun}
                  className="icon-clear"
                  style={{ fontSize: "64px" }}
                />
              ) : cityWeatherGeneralInformation?.main === "Snow" ? (
                <FontAwesomeIcon
                  icon={faSnowflake}
                  className="icon-snow"
                  style={{ fontSize: "64px" }}
                />
              ) : null}
            </h1>
            <h1 className="text-center text-white text-2xl subpixel-antialiased">
              {cityWeatherTemperature?.temp &&
                Math.floor(cityWeatherTemperature?.temp) + "°C"}
            </h1>
            <h1 className="text-center text-white text-2xl subpixel-antialiased">
              {cityWeatherTemperature?.feels_like &&
                "Feels like - " +
                  Math.floor(cityWeatherTemperature?.feels_like) +
                  "°C"}
            </h1>
            <h1 className="text-center text-white text-2xl subpixel-antialiased">
              {cityWindSpeed?.speed &&
                Math.round(
                  mps_to_kmph(cityWindSpeed?.speed + Number.EPSILON) * 100
                ) /
                  100 +
                  "km/h - "}
              {cityWindSpeed?.speed && (
                <FontAwesomeIcon icon={faWind} beatFade />
              )}
            </h1>
          </div>
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
          <div>
            {forecastButtonClicked && (
              <>
                <h1 className="text-center text-white mt-4 text-2xl">
                  {" "}
                  5-day forecast:
                </h1>
                <div className="flex gap-12 justify-center mt-3">
                  {cityFiveDayForecast.map((data: any, index: number) => (
                    <div className="flex flex-col gap-2 justify-center text-center w-32">
                      <h4
                        className="text-white text-2xl"
                        key={data.main.id + "_head"}
                      >
                        {getNextFiveDays()[index]}
                      </h4>
                      <h5
                        className="text-center text-white"
                        key={data?.main?.id + "_temp"}
                      >
                        {" "}
                        {Math.floor(data?.main?.temp)}
                        {"°C"}
                      </h5>
                      <h5
                        className="text-center text-white"
                        key={data.main.id + "_feel"}
                      >
                        {data?.main?.feels_like &&
                          "Feels like - " +
                            Math.floor(data?.main?.feels_like) +
                            "°C"}
                      </h5>
                      <h5
                        className="text-center text-white"
                        key={data.main.id + "_info"}
                      >
                        {data.weather[0].main === "Rain" ? (
                          <FontAwesomeIcon
                            icon={faCloudRain}
                            className="icon-rain"
                            style={{ fontSize: "32px" }}
                          />
                        ) : data.weather[0].main === "Clouds" ? (
                          <FontAwesomeIcon
                            icon={faCloud}
                            className="icon-cloud"
                            style={{ fontSize: "32px" }}
                          />
                        ) : data.weather[0].main === "Clear" ? (
                          <FontAwesomeIcon
                            icon={faSun}
                            className="icon-clear"
                            style={{ fontSize: "32px" }}
                          />
                        ) : data.weather[0].main === "Snow" ? (
                          <FontAwesomeIcon
                            icon={faSnowflake}
                            className="icon-snow"
                            style={{ fontSize: "32px" }}
                          />
                        ) : null}
                      </h5>
                      <h1
                        className="text-center text-white"
                        key={data.main.id + "_wind"}
                      >
                        {data?.wind?.speed &&
                          Math.round(
                            mps_to_kmph(data?.wind?.speed + Number.EPSILON) *
                              100
                          ) /
                            100 +
                            "km/h - "}
                        <FontAwesomeIcon icon={faWind} beatFade />
                      </h1>
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
