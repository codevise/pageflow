import {useEntryStateConfig} from "./EntryStateProvider";

export function useContentElementConsentVendor({contentElementId}) {
  const config = useEntryStateConfig();
  const vendorName = config.contentElementConsentVendors[contentElementId];

  return config.consentVendors.find(vendor => vendor.name === vendorName);
}
