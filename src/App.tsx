import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import WeatherInfo from "./components/WeatherInfo";
import FiveDayForecast from "./components/FiveDayForecast";
import Header from "./components/Header";

import "./App.css";

const apiKey = import.meta.env.VITE_OPEN_WEATHER_KEY;
const queryClient = new QueryClient();

interface CityCoordinates {
  lat: number;
  lon: number;
}

function App() {
  const [forecastButtonClicked, setForecastButtonClicked] =
    useState<boolean>(false);
  const [cityName, setCityName] = useState<string>("");
  const [cityCoordinates, setCityCoordinates] = useState<CityCoordinates>();

  const handleDataFromHeader = (
    clicked: boolean,
    name: string,
    coordinates: CityCoordinates
  ) => {
    setCityName(name);
    setForecastButtonClicked(clicked);
    setCityCoordinates(coordinates);
  };

  const handleShowForecastButton = () => {
    setForecastButtonClicked(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App flex items-center flex-col">
        <Header handleData={handleDataFromHeader} />
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
          <FiveDayForecast cityCoordinates={cityCoordinates} apiKey={apiKey} />
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;
