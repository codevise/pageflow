import {useEmbedOriginUrl} from 'entryState';

import {renderHookInEntry} from 'support';

describe('useEmbedOriginUrl', () => {
  it('returns undefined when embed is false', () => {
    const {result} = renderHookInEntry(
      () => useEmbedOriginUrl(), {
        seed: {
          embed: false,
          originUrl: 'https://example.com/my-entry'
        }
      }
    );

    expect(result.current).toBeUndefined();
  });

  it('returns undefined when embed is true but originUrl not set', () => {
    const {result} = renderHookInEntry(
      () => useEmbedOriginUrl(), {
        seed: {
          embed: true
        }
      }
    );

    expect(result.current).toBeUndefined();
  });

  it('returns originUrl when embed is true and originUrl is set', () => {
    const {result} = renderHookInEntry(
      () => useEmbedOriginUrl(), {
        seed: {
          embed: true,
          originUrl: 'https://example.com/my-entry'
        }
      }
    );

    expect(result.current).toEqual('https://example.com/my-entry');
  });
});
