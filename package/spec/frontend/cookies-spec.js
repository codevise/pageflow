import {setItemCookieString} from 'frontend/cookies';

describe('setItemCookieString', () => {
  it('supports legacy positional parameters', () => {
    const result = setItemCookieString(
      'key',
      'value',
      'Fri, 31 Dec 9999 23:59:58 GMT',
      '/',
      'example.com',
      true
    );

    expect(result).toEqual(
      'key=value; expires=Fri, 31 Dec 9999 23:59:58 GMT; ' +
      'domain=example.com; path=/; Secure'
    )
  });

  it('supports Infinity as positional expires parameter', () => {
    const result = setItemCookieString(
      'key',
      'value',
      Infinity,
      '/'
    );

    expect(result).toEqual(
      'key=value; expires=Fri, 31 Dec 9999 23:59:59 GMT; ' +
      'path=/'
    )
  });

  it('supports number as positional expires parameter', () => {
    const result = setItemCookieString(
      'key',
      'value',
      1628751374832
    );

    expect(result).toEqual('key=value; max-age=1628751374832')
  });

  it('supports date as positional expires parameter', () => {
    const result = setItemCookieString(
      'key',
      'value',
      new Date(Date.UTC(2021, 7, 12, 8, 59))
    );

    expect(result).toEqual('key=value; expires=Thu, 12 Aug 2021 08:59:00 GMT')
  });

  it('supports skipping legacy positional parameters', () => {
    const result = setItemCookieString(
      'key',
      'value',
      null,
      null,
      'example.com'
    );

    expect(result).toEqual('key=value; domain=example.com')
  });

  it('supports options parameter', () => {
    const result = setItemCookieString('key', 'value', {
      expires: Infinity,
      path: '/',
      domain: 'example.com',
      secure: true
    });

    expect(result).toEqual(
      'key=value; expires=Fri, 31 Dec 9999 23:59:59 GMT; ' +
      'domain=example.com; path=/; Secure'
    )
  });

  it('supports Infinity as expires option', () => {
    const result = setItemCookieString('key', 'value', {
      expires: Infinity,
      path: '/'
    });

    expect(result).toEqual(
      'key=value; expires=Fri, 31 Dec 9999 23:59:59 GMT; ' +
      'path=/'
    )
  });

  it('supports number as expires option', () => {
    const result = setItemCookieString('key', 'value', {expires: 1628751374832});

    expect(result).toEqual('key=value; max-age=1628751374832')
  });

  it('supports date as expires option', () => {
    const result = setItemCookieString('key', 'value', {
      expires: new Date(Date.UTC(2021, 7, 12, 8, 59))
    });

    expect(result).toEqual('key=value; expires=Thu, 12 Aug 2021 08:59:00 GMT')
  });

  it('supports secure option', () => {
    const result = setItemCookieString('key', 'value', {
      secure: true
    });

    expect(result).toEqual('key=value; Secure')
  });

  it('supports sameSite option', () => {
    const result = setItemCookieString('key', 'value', {
      sameSite: 'None'
    });

    expect(result).toEqual('key=value; SameSite=None')
  });
});
