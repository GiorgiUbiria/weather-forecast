import { useState, useEffect, Dispatch, SetStateAction } from 'react';

type NavigatorWithBadge = Navigator & {
  setAppBadge?: (temperature: number) => void;
  setClientBadge?: ({ temperature }: { temperature: number }) => void;
};

const useAppBadge = (): [() => void, () => void, Dispatch<SetStateAction<number | null>>] => {
  const [temperature, setTemperature] = useState<number | null>(null);

  const setBadge = () => {
    updateBadge(temperature as number);
  };

  const clearBadge = () => {
    updateBadge(0);
  };

  const updateBadge = (temperature: number) => {
    const navigatorWithBadge = navigator as NavigatorWithBadge;

    if (navigatorWithBadge.setAppBadge) {
      navigatorWithBadge.setAppBadge(temperature);
    } else if (navigatorWithBadge.setClientBadge) {
      navigatorWithBadge.setClientBadge({ temperature });
    }
  };

  useEffect(() => {
    if (temperature !== null) {
      updateBadge(temperature);
    }
  }, [temperature]);

  return [setBadge, clearBadge, setTemperature];
};

export default useAppBadge;