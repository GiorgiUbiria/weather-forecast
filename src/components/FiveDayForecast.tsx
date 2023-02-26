import { useQuery } from "@tanstack/react-query";

import Skeleton from "@mui/material/Skeleton";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudRain,
  faSun,
  faCloud,
  faSnowflake,
  faWind,
} from "@fortawesome/free-solid-svg-icons";

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

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

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

const FiveDayForecast: React.FC<WeatherInfoProps> = ({
  cityCoordinates,
  apiKey,
}) => {
  const { data, isLoading, isError } = useQuery(
    ["fiveDayForecast", cityCoordinates, apiKey],
    async () => {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${cityCoordinates?.lat}&lon=${cityCoordinates?.lon}&appid=${apiKey}&units=metric`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    }
  );

  let newArr = data?.list?.filter((value: any, index: number, Arr: any) => {
    return index % 8 == 0;
  });

  if (isLoading)
    return (
      <Skeleton
        variant="rectangular"
        width={500}
        height={200}
        animation="wave"
        className="mt-2"
      />
    );

  if (isError) return <div>Error fetching data</div>;

  const cityFiveDayForecast = newArr ?? {};

  return (
    <div>
      <h1 className="text-center text-white mt-4 text-2xl"> 5 day forecast:</h1>
      <div className="flex gap-12 justify-center mt-3">
        {cityFiveDayForecast.map((data: any, index: number) => (
          <div className="flex flex-col gap-2 justify-center text-center w-32">
            <h4 className="text-white" key={data.main.id + "_head"}>
              {getNextFiveDays()[index]}
            </h4>
            <h5 className="text-center text-white" key={data.main.id + "_temp"}>
              {" "}
              {Math.floor(data.main.temp)}
              {"°C"}
            </h5>
            <h5 className="text-center text-white" key={data.main.id + "_feel"}>
              {data?.main?.feels_like &&
                "Feels like - " + Math.floor(data?.main?.feels_like) + "°C"}
            </h5>
            <h5 className="text-center text-white" key={data.main.id + "_info"}>
              {data.weather[0].main === "Rain" ? (
                <FontAwesomeIcon
                  icon={faCloudRain}
                  className="icon-rain"
                  style={{ fontSize: "32px" }}
                />
              ) : data.weather[0].main === "Clouds" ? (
                <FontAwesomeIcon
                  icon={faCloud}
                  className="icon"
                  style={{ fontSize: "32px" }}
                />
              ) : data.weather[0].main === "Clear" ? (
                <FontAwesomeIcon
                  icon={faSun}
                  className="icon-sun"
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
            <h1 className="text-center text-white" key={data.main.id + "_wind"}>
              {data?.wind?.speed &&
                Math.round(
                  mps_to_kmph(data?.wind?.speed + Number.EPSILON) * 100
                ) /
                  100 +
                  "km/h - "}
              <FontAwesomeIcon icon={faWind} beatFade />
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FiveDayForecast;
