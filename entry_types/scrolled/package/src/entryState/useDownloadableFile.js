import {useFile} from './useFile';

export function useDownloadableFile(options) {
  const file = useFile(options);

  return file && {
    ...file,
    urls: {
      ...file.urls,
      download: `${file.urls.original}?download=${encodeURIComponent(file.displayName)}`
    }
  }
}
