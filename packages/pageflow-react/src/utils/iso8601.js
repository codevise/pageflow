export function formatTimeDuration(durationInMs) {
  const seconds = Math.round(durationInMs / 1000) % 60;
  const minutes = Math.floor(durationInMs / 1000 / 60) % 60;
  const hours = Math.floor(durationInMs / 1000 / 60 / 60);

  let result = 'PT';

  if (hours > 0) {
    result += `${hours}H`;
  }

  if (minutes > 0) {
    result += `${minutes}M`;
  }

  if (seconds > 0 || (minutes == 0 && hours == 0)) {
    result += `${seconds}S`;
  }

  return result;
}
