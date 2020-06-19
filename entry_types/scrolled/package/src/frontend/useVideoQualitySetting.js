import {useSetting} from './useSetting';

export function useVideoQualitySetting() {
  const[value, setValue] = useSetting('videoQualitySetting');
  return [value || 'auto', setValue];
}
