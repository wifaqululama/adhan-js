import Coordinates from './Coordinates';
import SolarTime from './SolarTime';
import { dateByAddingDays } from './DateUtils';
import { ValueOf } from './TypeUtils';
import { Temporal } from 'temporal-polyfill';

export const PolarCircleResolution = {
  AqrabBalad: 'AqrabBalad',
  AqrabYaum: 'AqrabYaum',
  Unresolved: 'Unresolved',
} as const;

const LATITUDE_VARIATION_STEP = 0.5; // Degrees to add/remove at each resolution step
const UNSAFE_LATITUDE = 65; // Based on https://en.wikipedia.org/wiki/Midnight_sun

const isValidSolarTime = (solarTime: SolarTime) =>
  !isNaN(solarTime.sunrise) && !isNaN(solarTime.sunset);

const aqrabYaumResolver = (
  coordinates: Coordinates,
  date: Temporal.PlainDateTime,
  daysAdded = 1,
  direction = 1,
): {
  date: Temporal.PlainDateTime;
  tomorrow: Temporal.PlainDateTime;
  coordinates: Coordinates;
  solarTime: SolarTime;
  tomorrowSolarTime: SolarTime;
} | null => {
  if (daysAdded > Math.ceil(365 / 2)) {
    return null;
  }
  const testDate = date.add({ days: direction * daysAdded });
  const tomorrow = date.add({ days: 1 });
  const solarTime = new SolarTime(testDate.toPlainDate(), coordinates);
  const tomorrowSolarTime = new SolarTime(tomorrow.toPlainDate(), coordinates);

  if (!isValidSolarTime(solarTime) || !isValidSolarTime(tomorrowSolarTime)) {
    return aqrabYaumResolver(
      coordinates,
      date,
      daysAdded + (direction > 0 ? 0 : 1),
      -direction,
    );
  }

  return {
    date,
    tomorrow,
    coordinates,
    solarTime,
    tomorrowSolarTime,
  };
};

const aqrabBaladResolver = (
  coordinates: Coordinates,
  date: Temporal.PlainDate,
  latitude: number,
): {
  date: Temporal.PlainDate;
  tomorrow: Temporal.PlainDate;
  coordinates: Coordinates;
  solarTime: SolarTime;
  tomorrowSolarTime: SolarTime;
} | null => {
  const solarTime = new SolarTime(date, { ...coordinates, latitude });
  const tomorrow = date.add({ days: 1 });
  const tomorrowSolarTime = new SolarTime(tomorrow, {
    ...coordinates,
    latitude,
  });
  if (!isValidSolarTime(solarTime) || !isValidSolarTime(tomorrowSolarTime)) {
    return Math.abs(latitude) >= UNSAFE_LATITUDE
      ? aqrabBaladResolver(
          coordinates,
          date,
          latitude - Math.sign(latitude) * LATITUDE_VARIATION_STEP,
        )
      : null;
  }

  return {
    date,
    tomorrow,
    coordinates: new Coordinates(latitude, coordinates.longitude),
    solarTime,
    tomorrowSolarTime,
  };
};

export const polarCircleResolvedValues = (
  resolver: ValueOf<typeof PolarCircleResolution>,
  date: Temporal.PlainDate,
  coordinates: Coordinates,
) => {
  const defaultReturn = {
    date,
    tomorrow: date.add({ days: 1 }),
    coordinates,
    solarTime: new SolarTime(date, coordinates),
    tomorrowSolarTime: new SolarTime(date.add({ days: 1 }), coordinates),
  };

  switch (resolver) {
    case PolarCircleResolution.AqrabYaum: {
      const dateTime = Temporal.PlainDateTime.from({
        year: date.year,
        month: date.month,
        day: date.day,
        hour: 12,
        minute: 0,
      });
      return aqrabYaumResolver(coordinates, dateTime) || defaultReturn;
    }
    case PolarCircleResolution.AqrabBalad: {
      const { latitude } = coordinates;
      return (
        aqrabBaladResolver(
          coordinates,
          date,
          latitude - Math.sign(latitude) * LATITUDE_VARIATION_STEP,
        ) || defaultReturn
      );
    }
    default: {
      return defaultReturn;
    }
  }
};
