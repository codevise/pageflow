import {useEntryStateConfig} from "./EntryStateProvider";

export function useEmbedOriginUrl() {
  const config = useEntryStateConfig();
  return config.embed ? config.originUrl : undefined;
}
