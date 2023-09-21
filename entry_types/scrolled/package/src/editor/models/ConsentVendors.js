export function ConsentVendors({hostMatchers}) {
  return {
    fromUrl(url) {
      url = new URL(url);

      return Object.entries(hostMatchers).find(([matcher]) =>
        new RegExp(matcher).test(url.host)
      )?.[1];
    }
  }
}
