import { useState } from "react";
import "./App.css";

const apiKey = import.meta.env.VITE_OPEN_WEATHER_KEY;

interface CityCoordinates {
  lat: number;
  lon: number;
}

function App() {
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

  const getCoordinatesOfTheCityFromAPI = async (): Promise<void> => {
    const response = await (
      await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=Tbilisi&limit=5&appid=${apiKey}`
      )
    ).json();

    const { lat, lon } = response[1];

    setCityCoordinates({ lat, lon });
  };

  const getCityWeatherTemperatureFromAPI = async (): Promise<void> => {
    const response = await (
      await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${cityCoordinates?.lat}&lon=${cityCoordinates?.lon}&appid=${apiKey}`
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

  console.log(cityCoordinates);
  console.log(cityWeatherTemperature);

  return (
    <>
      <h1 className="text-3xl font-bold underline text-center mb-4">
        Hello world!
      </h1>
      <div className="grid grid-cols-3 gap-4 justify-items-center">
        <button
          className="border-2 rounded-md border-black bg-white text-center text-base text-black shadow-md w-48 hover:bg-sky-700"
          onClick={getCoordinatesOfTheCityFromAPI}
        >
          Get Coordinates!
        </button>
        <button
          className="border-2 rounded-md border-black bg-white text-center text-base text-black shadow-md w-48 hover:bg-sky-700"
          onClick={getCityWeatherTemperatureFromAPI}
        >
          Get Weather Temperature!
        </button>
        <button
          className="border-2 rounded-md border-black bg-white text-center text-base text-black shadow-md w-48 hover:bg-sky-700"
          onClick={getCityWeatherGeneralInformationFromAPI}
        >
          Get Weather Information!
        </button>
        <div>{cityWeatherTemperature?.temp}</div>
        <div>{cityWeatherGeneralInformation?.main}</div>
        <div>{cityWeatherGeneralInformation?.description}</div>
      </div>
    </>
  );
}

export default App;
