import {Persistence} from 'frontend/Consent/Persistence';

describe('storing consent for all vendors', () => {
  it('stores allAccepted signal in cookie', () => {
    const cookies = fakeCookies();
    const vendors = [{name: 'xyAnalytics', cookieName: 'tracking'}];

    new Persistence({cookies}).store(vendors, 'accepted');

    expect(JSON.parse(cookies.getItem('tracking'))).toEqual({xyAnalytics: true});
  });

  it('stores all denied signal in cookie', () => {
    const cookies = fakeCookies();
    const vendors = [{name: 'xyAnalytics', cookieName: 'tracking'}];

    new Persistence({cookies}).store(vendors, 'denied');

    expect(JSON.parse(cookies.getItem('tracking'))).toEqual({xyAnalytics: false});
  });

  it('supports vendors with different cookie names', () => {
    const cookies = fakeCookies();
    const vendors = [{name: 'xyAnalytics', cookieName: 'tracking'},
                     {name: 'yzAnalytics', cookieName: 'yz'}];

    new Persistence({cookies}).store(vendors, 'accepted');

    expect(JSON.parse(cookies.getItem('tracking'))).toEqual({xyAnalytics: true});
    expect(JSON.parse(cookies.getItem('yz'))).toEqual({yzAnalytics: true});
  });

  it('supports vendors with custom cookie keys', () => {
    const cookies = fakeCookies();
    const vendors =
          [{name: 'xyAnalytics', cookieKey: 'x_y', cookieName: 'tracking'}];

    new Persistence({cookies}).store(vendors, 'accepted');

    expect(JSON.parse(cookies.getItem('tracking'))).toEqual({x_y: true});
  });

  it('supports simultaneous accepts and denies', () => {
    const cookies = fakeCookies();
    const vendors = [{name: 'xyAnalytics', cookieName: 'tracking'},
                     {name: 'yzAnalytics', cookieName: 'tracking'}];

    new Persistence({cookies}).store(vendors, {xyAnalytics: false, yzAnalytics: true});

    expect(JSON.parse(cookies.getItem('tracking'))).toEqual(
      {xyAnalytics: false, yzAnalytics: true}
    );
  });

  describe('for vendors with cookie domain', () => {
    it('does not use domain if domain does not match hostname', () => {
      // location.hostname is set to story.example.com via testURL in jest.config.js

      const cookies = fakeCookies();
      const vendors = [{name: 'xyAnalytics',
                        cookieName: 'tracking',
                        cookieDomain: 'other.example.com'}];
      const persistence = new Persistence({cookies});

      jest.spyOn(cookies, 'setItem');
      persistence.store(vendors, {xyAnalytics: true});

      expect(cookies.setItem).toHaveBeenCalledWith('tracking', expect.anything(), {
        path: '/',
        domain: null,
        expires: Infinity,
        sameSite: 'None',
        secure: true
      });
    });

    it('writes to cookie for domain if domain matches hostname', () => {
      // location.hostname is set to story.example.com via testURL in jest.config.js

      const cookies = fakeCookies();
      const vendors = [{name: 'xyAnalytics',
                        cookieName: 'tracking',
                        cookieDomain: 'example.com'}];
      const persistence = new Persistence({cookies});

      jest.spyOn(cookies, 'setItem');
      persistence.store(vendors, {xyAnalytics: true});

      expect(cookies.setItem).toHaveBeenCalledWith('tracking', expect.anything(), {
        path: '/',
        domain: 'example.com',
        expires: Infinity,
        sameSite: 'None',
        secure: true
      });
    });
  });
});

describe('updating consent for single vendor', () => {
  it('updates cookie value', () => {
    const cookies = fakeCookies();
    const vendors = [{name: 'xyAnalytics', cookieName: 'tracking'},
                     {name: 'yzAnalytics', cookieName: 'tracking'}];
    const persistence = new Persistence({cookies});

    persistence.store(vendors, 'accepted');
    persistence.update(vendors[0], false);

    expect(JSON.parse(cookies.getItem('tracking'))).toEqual(
      {xyAnalytics: false, yzAnalytics: true}
    );
  });

  it('supports custom cookie key', () => {
    const cookies = fakeCookies();
    const vendors = [{name: 'xyAnalytics', cookieName: 'tracking', cookieKey: 'x_y'}];
    const persistence = new Persistence({cookies});

    persistence.update(vendors[0], true);

    expect(JSON.parse(cookies.getItem('tracking'))).toEqual(
      {x_y: true}
    );
  });

  describe('for vendors with cookie domain', () => {
    it('does not use domain if domain does not match hostname', () => {
      // location.hostname is set to story.example.com via testURL in jest.config.js

      const cookies = fakeCookies();
      const vendors = [{name: 'xyAnalytics',
                        cookieName: 'tracking',
                        cookieDomain: 'other.example.com'}];
      const persistence = new Persistence({cookies});

      jest.spyOn(cookies, 'setItem');
      persistence.update(vendors[0], true);

      expect(cookies.setItem).toHaveBeenCalledWith('tracking', expect.anything(), {
        path: '/',
        domain: null,
        expires: Infinity,
        sameSite: 'None',
        secure: true
      });
    });

    it('writes to cookie for domain if domain matches hostname', () => {
      // location.hostname is set to story.example.com via testURL in jest.config.js

      const cookies = fakeCookies();
      const vendors = [{name: 'xyAnalytics',
                        cookieName: 'tracking',
                        cookieDomain: 'example.com'}];
      const persistence = new Persistence({cookies});

      jest.spyOn(cookies, 'setItem');
      persistence.update(vendors[0], true);

      expect(cookies.setItem).toHaveBeenCalledWith('tracking', expect.anything(), {
        path: '/',
        domain: 'example.com',
        expires: Infinity,
        sameSite: 'None',
        secure: true
      });
    });
  });
});

describe('reading consent', () => {
  it('returns `accepted` if flag in cookie is true', () => {
    const cookies = fakeCookies();
    const vendors = [{name: 'xyAnalytics', cookieName: 'tracking'}];

    cookies.setItem('tracking', JSON.stringify({xyAnalytics: true}));
    const result = new Persistence({cookies}).read(vendors[0]);

    expect(result).toEqual('accepted');
  });

  it('returns `denied` if flag in cookie is false', () => {
    const cookies = fakeCookies();
    const vendors = [{name: 'xyAnalytics', cookieName: 'tracking'}];

    cookies.setItem('tracking', JSON.stringify({xyAnalytics: false}));
    const result = new Persistence({cookies}).read(vendors[0]);

    expect(result).toEqual('denied');
  });

  it('returns `undecided` if flag in cookie is missing', () => {
    const cookies = fakeCookies();
    const vendors = [{name: 'xyAnalytics', cookieName: 'tracking'}];

    cookies.setItem('tracking', JSON.stringify());
    const result = new Persistence({cookies}).read(vendors[0]);

    expect(result).toEqual('undecided');
  });

  it('returns `undecided` if cookie is missing', () => {
    const cookies = fakeCookies();
    const vendors = [{name: 'xyAnalytics', cookieName: 'tracking'}];

    const result = new Persistence({cookies}).read(vendors[0]);

    expect(result).toEqual('undecided');
  });
});

function fakeCookies() {
  const cookies = {};

  return {
    hasItem(key) { return !!cookies[key]; },

    getItem(key) { return cookies[key]; },

    setItem(key, value) { cookies[key] = value; }
  };
}
