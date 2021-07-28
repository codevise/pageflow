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
      this.cookies.setItem(cookieName,
                      JSON.stringify(vendors.reduce((result, vendor) => {
                        result[vendor.cookieKey || vendor.name] =
                          (signal === 'accepted' ? true :
                           signal === 'denied' ? false :
                           signal[vendor.name]);
                        return result;
                      }, {})), null, '/');
    });
  }


  update(vendor, signal) {
    const cookieDomain = vendor.cookieDomain;

    if (cookieDomain &&
        !window.location.hostname.match(new RegExp(`${cookieDomain}$`))) {
      return;
    }

    const content = this.cookies.getItem(vendor.cookieName);
    const flags = content ? JSON.parse(content) : {};

    this.cookies.setItem(vendor.cookieName,
                         JSON.stringify({
                           ...flags,
                           [vendor.cookieKey || vendor.name]: signal
                         }), null, '/', cookieDomain);
  }

  read(vendor) {
    const content = this.cookies.getItem(vendor.cookieName);
    const flags = content ? JSON.parse(content) : {};
    const flag = flags[vendor.cookieKey || vendor.name];
    return flag === true ? 'accepted' :
      flag === false ? 'denied' : 'undecided';
  }
}
