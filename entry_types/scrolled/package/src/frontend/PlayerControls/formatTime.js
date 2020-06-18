const unknownTimePlaceholder = '-:--';

export function formatTime(value) {
  if (isNaN(value)) {
    return unknownTimePlaceholder;
  }

  const seconds = Math.floor(value) % 60;
  const minutes = Math.floor(value / 60) % 60;
  const hours = Math.floor(value / 60 / 60);

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }
  else {
    return `${minutes}:${pad(seconds)}`;
  }
}

function pad(value) {
  return value < 10 ? ('0' + value) : value;
}
