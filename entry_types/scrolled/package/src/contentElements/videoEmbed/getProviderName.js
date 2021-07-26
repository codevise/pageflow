const youtubeMatcher = /youtube\.com\/|youtu\.be\//;
const vimeoMatcher = /vimeo\.com\//;
const facebookMatcher = /facebook\.com\//;

export function getProviderName(url) {
  if (youtubeMatcher.test(url)) {
    return 'youtube';
  }
  else if (vimeoMatcher.test(url)) {
    return 'vimeo';
  }
  else if (facebookMatcher.test(url)) {
    return 'facebook';
  }

  return null;
}
