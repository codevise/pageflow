export function ConsentVendors({urlMatchers}) {
  return {
    fromUrl(url) {
      url = new URL(url);

      return Object.entries(urlMatchers).find(([matcher]) =>
        new RegExp(matcher).test(url.host + url.pathname)
      )?.[1];
    }
  }
}
