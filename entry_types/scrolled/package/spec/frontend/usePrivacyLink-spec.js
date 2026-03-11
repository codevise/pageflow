import {usePrivacyLink} from 'frontend/usePrivacyLink';

import {renderHookInEntry} from 'support';

describe('usePrivacyLink', () => {
  it('returns url and label without modifications when called without args', () => {
    const {result} = renderHookInEntry(
      () => usePrivacyLink(), {
        seed: {
          legalInfo: {
            privacy: {url: 'https://example.com/privacy', label: 'Privacy'}
          }
        }
      }
    );

    expect(result.current.url).toEqual('https://example.com/privacy');
    expect(result.current.label).toEqual('Privacy');
  });

  it('returns empty string when privacy url is empty', () => {
    const {result} = renderHookInEntry(
      () => usePrivacyLink({vendors: 'spotify'}), {
        seed: {
          legalInfo: {
            privacy: {url: ''}
          }
        }
      }
    );

    expect(result.current.url).toEqual('');
  });

  it('appends vendors param and consent hash to absolute url', () => {
    const {result} = renderHookInEntry(
      () => usePrivacyLink({vendors: 'spotify'}), {
        seed: {
          legalInfo: {
            privacy: {url: 'https://example.com/privacy'}
          }
        }
      }
    );

    expect(result.current.url)
      .toEqual('https://example.com/privacy?vendors=spotify#consent');
  });

  it('appends vendors param to url with existing params', () => {
    const {result} = renderHookInEntry(
      () => usePrivacyLink({vendors: 'spotify'}), {
        seed: {
          legalInfo: {
            privacy: {url: 'https://example.com/privacy?lang=de'}
          }
        }
      }
    );

    expect(result.current.url)
      .toEqual('https://example.com/privacy?lang=de&vendors=spotify#consent');
  });

  it('preserves protocol-relative url format', () => {
    const {result} = renderHookInEntry(
      () => usePrivacyLink({vendors: 'spotify'}), {
        seed: {
          legalInfo: {
            privacy: {url: '//example.com/privacy?lang=de'}
          }
        }
      }
    );

    expect(result.current.url)
      .toEqual('//example.com/privacy?lang=de&vendors=spotify#consent');
  });

  it('handles relative path', () => {
    const {result} = renderHookInEntry(
      () => usePrivacyLink({vendors: 'spotify'}), {
        seed: {
          legalInfo: {
            privacy: {url: '/privacy?lang=de'}
          }
        }
      }
    );

    expect(result.current.url)
      .toEqual('/privacy?lang=de&vendors=spotify#consent');
  });

  it('supports comma-separated vendor names', () => {
    const {result} = renderHookInEntry(
      () => usePrivacyLink({vendors: 'spotify,youtube'}), {
        seed: {
          legalInfo: {
            privacy: {url: 'https://example.com/privacy'}
          }
        }
      }
    );

    expect(result.current.url)
      .toEqual('https://example.com/privacy?vendors=spotify%2Cyoutube#consent');
  });

  it('returns link props with href and target', () => {
    const {result} = renderHookInEntry(
      () => usePrivacyLink(), {
        seed: {
          legalInfo: {
            privacy: {url: 'https://example.com/privacy'}
          }
        }
      }
    );

    expect(result.current.props).toEqual({
      href: 'https://example.com/privacy',
      target: '_blank',
      rel: 'noreferrer noopener'
    });
  });

  it('returns props with onClick for javascript: privacy settings url', () => {
    const {result} = renderHookInEntry(
      // eslint-disable-next-line no-script-url
      () => usePrivacyLink(), {
        seed: {
          legalInfo: {
            privacy: {url: 'javascript:pageflowDisplayPrivacySettings()'}
          }
        }
      }
    );

    expect(result.current.props.href).toEqual('#privacySettings');
    expect(result.current.props.onClick).toBeInstanceOf(Function);
    expect(result.current.props.target).toBeUndefined();
  });

  it('does not append vendors to javascript: privacy settings url', () => {
    const {result} = renderHookInEntry(
      // eslint-disable-next-line no-script-url
      () => usePrivacyLink({vendors: 'spotify'}), {
        seed: {
          legalInfo: {
            privacy: {url: 'javascript:pageflowDisplayPrivacySettings()'}
          }
        }
      }
    );

    expect(result.current.props.href).toEqual('#privacySettings');
    expect(result.current.props.onClick).toBeInstanceOf(Function);
    expect(result.current.props.target).toBeUndefined();
  });

  it('returns link props with vendors param in href', () => {
    const {result} = renderHookInEntry(
      () => usePrivacyLink({vendors: 'spotify'}), {
        seed: {
          legalInfo: {
            privacy: {url: 'https://example.com/privacy'}
          }
        }
      }
    );

    expect(result.current.props).toEqual({
      href: 'https://example.com/privacy?vendors=spotify#consent',
      target: '_blank',
      rel: 'noreferrer noopener'
    });
  });
});
