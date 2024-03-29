import { useQuery } from "@tanstack/react-query";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudRain,
  faSun,
  faCloud,
  faSnowflake,
  faWind,
} from "@fortawesome/free-solid-svg-icons";
import { Skeleton } from "@mui/material";

interface CityCoordinates {
  lat: number;
  lon: number;
}

interface WeatherInfoProps {
  cityCoordinates: CityCoordinates | undefined;
  apiKey: string;
}

function mps_to_kmph(mps: number) {
  return 3.6 * mps;
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({
  cityCoordinates,
  apiKey,
}) => {
  const { data, isLoading, isError } = useQuery(
    ["cityWeatherInformation", cityCoordinates, apiKey],
    async () => {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${cityCoordinates?.lat}&lon=${cityCoordinates?.lon}&appid=${apiKey}&units=metric`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    }
  );

  if (isLoading)
    return (
      <Skeleton
        variant="rectangular"
        width={300}
        height={180}
        animation="wave"
        className="mt-2"
      />
    );

  if (isError) return <div>Error fetching data</div>;

  const cityWeatherTemperature = data?.main ?? {};
  const cityWeatherGeneralInformation = data?.weather?.[0] ?? {};
  const cityWindSpeed = data?.wind ?? {};

  return (
    <div className="flex flex-col md:gap-2 sm:gap-1">
      <h1 className="text-center text-white text-2xl subpixel-antialiased mt-2 md:text-4xl">
        {cityWeatherGeneralInformation?.main &&
        cityWeatherGeneralInformation?.main === "Rain" ? (
          <FontAwesomeIcon icon={faCloudRain} className="icon-rain" />
        ) : cityWeatherGeneralInformation?.main === "Clouds" ? (
          <FontAwesomeIcon icon={faCloud} className="icon" />
        ) : cityWeatherGeneralInformation?.main === "Clear" ? (
          <FontAwesomeIcon icon={faSun} className="icon-sun" />
        ) : cityWeatherGeneralInformation?.main === "Snow" ? (
          <FontAwesomeIcon icon={faSnowflake} className="icon-snow" />
        ) : null}
      </h1>
      <h1 className="text-center text-white subpixel-antialiased md:text-3xl sm:text-2xl">
        {cityWeatherTemperature?.temp &&
          Math.floor(cityWeatherTemperature?.temp) + "°C"}
      </h1>
      <h1 className="text-center text-white subpixel-antialiased md:text-3xl sm:text-2xl">
        {cityWeatherTemperature?.feels_like &&
          "Feels like - " +
            Math.floor(cityWeatherTemperature?.feels_like) +
            "°C"}
      </h1>
      <h1 className="text-center text-white subpixel-antialiased  md:text-3xl sm:text-2xl">
        {cityWindSpeed?.speed &&
          Math.round(mps_to_kmph(cityWindSpeed?.speed + Number.EPSILON) * 100) /
            100 +
            "km/h - "}
        {cityWindSpeed?.speed && <FontAwesomeIcon icon={faWind} beatFade />}
      </h1>
    </div>
  );
};

export default WeatherInfo;
