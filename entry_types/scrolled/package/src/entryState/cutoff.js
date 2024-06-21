import {useEntryStateConfig} from "./EntryStateProvider";

export function useCutOff() {
  const config = useEntryStateConfig();
  return config.cutOff;
}
