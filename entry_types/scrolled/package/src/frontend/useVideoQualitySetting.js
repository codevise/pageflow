import {useSetting} from './useSetting';

export function useVideoQualitySetting() {
  const[value, setValue] = useSetting('videoQuality');
  return [value || 'auto', setValue];
}
