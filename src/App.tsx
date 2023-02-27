import { useCallback, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Particles from "react-particles";
import { loadFull } from "tsparticles";
import { ISourceOptions } from "tsparticles-engine";

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

const options: ISourceOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        area: 1500,
      },
    },
    color: {
      value: ["#2EB67D", "#ECB22E", "#E01E5B", "#36C5F0", "#FFFF"],
    },
    shape: {
      type: "star",
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

function App() {
  const [forecastButtonClicked, setForecastButtonClicked] =
    useState<boolean>(false);
  const [cityName, setCityName] = useState<string>("");
  const [cityCoordinates, setCityCoordinates] = useState<CityCoordinates>();

  const particlesInit = useCallback(async (engine: any) => {
    await loadFull(engine);
  }, []);

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
        <Particles options={options} init={particlesInit} />
        <Header handleData={handleDataFromHeader} />
        <WeatherInfo cityCoordinates={cityCoordinates} apiKey={apiKey} />
        <div className="flex justify-center">
          {cityName !== "" ? (
            <button
              className="text-white text-xl subpixel-antialiased font-medium border rounded-sm p-1 mt-2 hover:scale-105 w-72 sm:w-96 sm:text-3xl sm:border-2 sm:rounded-md sm:p-2 sm:mt-6"
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
