import {useEntryStateConfig} from "./EntryStateProvider";

export function useEntryTranslations() {
  const config = useEntryStateConfig();
  return config.entryTranslations;
}
