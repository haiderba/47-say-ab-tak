export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  zuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  nextPrayerName: string;
  nextPrayerTime: string;
}

export function calculatePakistaniPrayerTimes(lat: number, lng: number, date: Date = new Date()): PrayerTimes {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const b = (2 * Math.PI * (dayOfYear - 81)) / 364;
  const eqtime = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
  const declination = 23.45 * Math.sin((2 * Math.PI * (284 + dayOfYear)) / 365);
  
  const timezone = 5;
  const solarNoonMinutes = 720 - 4 * lng - eqtime + timezone * 60;
  
  const rad = Math.PI / 180;
  const latRad = lat * rad;
  const decRad = declination * rad;
  
  const fajrAngle = 18 * rad;
  const cosFajr = (-Math.sin(fajrAngle) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));
  const fajrHA = Math.acos(Math.max(-1, Math.min(1, cosFajr))) / rad;
  
  const sunAngle = 0.833 * rad;
  const cosSun = (-Math.sin(sunAngle) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));
  const sunHA = Math.acos(Math.max(-1, Math.min(1, cosSun))) / rad;
  
  const asrAlt = Math.atan(1 / (2 + Math.tan(Math.abs(latRad - decRad)))) / rad;
  const cosAsr = (Math.sin(asrAlt * rad) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));
  const asrHA = Math.acos(Math.max(-1, Math.min(1, cosAsr))) / rad;

  const fajrMin = solarNoonMinutes - fajrHA * 4;
  const sunriseMin = solarNoonMinutes - sunHA * 4;
  const zuhrMin = solarNoonMinutes + 4;
  const asrMin = solarNoonMinutes + asrHA * 4;
  const maghribMin = solarNoonMinutes + sunHA * 4 + 2;
  const ishaMin = solarNoonMinutes + fajrHA * 4;

  const formatMin = (m: number) => {
    const totalMinutes = Math.round(m);
    const hrs = Math.floor(totalMinutes / 60) % 24;
    const mins = totalMinutes % 60;
    const period = hrs >= 12 ? "PM" : "AM";
    const displayHrs = hrs % 12 === 0 ? 12 : hrs % 12;
    return displayHrs + ":" + (mins < 10 ? "0" : "") + mins + " " + period;
  };

  const nowMinutes = date.getHours() * 60 + date.getMinutes();
  let nextName = "Fajr";
  let nextTime = formatMin(fajrMin);

  if (nowMinutes < fajrMin) {
    nextName = "Fajr";
    nextTime = formatMin(fajrMin);
  } else if (nowMinutes < zuhrMin) {
    nextName = "Zuhr";
    nextTime = formatMin(zuhrMin);
  } else if (nowMinutes < asrMin) {
    nextName = "Asr";
    nextTime = formatMin(asrMin);
  } else if (nowMinutes < maghribMin) {
    nextName = "Maghrib";
    nextTime = formatMin(maghribMin);
  } else if (nowMinutes < ishaMin) {
    nextName = "Isha";
    nextTime = formatMin(ishaMin);
  } else {
    nextName = "Fajr";
    nextTime = formatMin(fajrMin);
  }

  return {
    fajr: formatMin(fajrMin),
    sunrise: formatMin(sunriseMin),
    zuhr: formatMin(zuhrMin),
    asr: formatMin(asrMin),
    maghrib: formatMin(maghribMin),
    isha: formatMin(ishaMin),
    nextPrayerName: nextName,
    nextPrayerTime: nextTime,
  };
}
