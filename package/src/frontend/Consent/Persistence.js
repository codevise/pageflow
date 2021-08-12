export class Persistence {
  constructor({cookies}) {
    this.cookies = cookies;
  }

  store(vendors, signal) {
    const vendorsByCookieName = vendors.reduce((sorted, vendor) => {
      const cookieName = vendor.cookieName;
      sorted[cookieName] = sorted[cookieName] || [];
      sorted[cookieName].push(vendor);
      return sorted;
    }, {});
    Object.entries(vendorsByCookieName).forEach(([cookieName, vendors]) => {
      const cookieDomain = vendors[0].cookieDomain;

      this.setCookie(
        cookieName,
        JSON.stringify(vendors.reduce((result, vendor) => {
          result[vendor.cookieKey || vendor.name] =
            (signal === 'accepted' ? true :
             signal === 'denied' ? false :
             signal[vendor.name]);
          return result;
        }, {})),
        cookieDomain
      );
    });
  }

  update(vendor, signal) {
    const content = this.cookies.getItem(vendor.cookieName);
    const flags = content ? JSON.parse(content) : {};

    this.setCookie(
      vendor.cookieName,
      JSON.stringify({
        ...flags,
        [vendor.cookieKey || vendor.name]: signal
      }),
      vendor.cookieDomain
    );
  }

  read(vendor) {
    const content = this.cookies.getItem(vendor.cookieName);
    const flags = content ? JSON.parse(content) : {};
    const flag = flags[vendor.cookieKey || vendor.name];
    return flag === true ? 'accepted' :
      flag === false ? 'denied' : 'undecided';
  }

  setCookie(name, value, domain) {
    if (domain &&
        !window.location.hostname.match(new RegExp(`${domain}$`))) {
      domain = null;
    }

    this.cookies.setItem(
      name,
      value,
      {
        path: '/',
        domain,
        expires: Infinity,
        // Ensure cookie can be read iframe embed
        sameSite: 'None',
        secure: true
      }
    );
  }
}
