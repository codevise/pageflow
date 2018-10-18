export const MUTE = 'BACKGROUND_MEDIA_MUTE';

export const UNMUTE = 'BACKGROUND_MEDIA_UNMUTE';

export function mute() {
  return {
    type: MUTE
  };
}

export function unmute() {
  return {
    type: UNMUTE
  };
}
