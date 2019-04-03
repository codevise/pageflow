import {ensureProtocol} from '../urls';

import {expect} from 'support';

describe('ensureProtocol', () => {
  it('adds protocol to protocol relative urls', () => {
    expect(ensureProtocol('http', '//example.com')).to.eq('http://example.com');
  });

  it('does not change url that has matching protocol', () => {
    expect(ensureProtocol('http', 'http://example.com')).to.eq('http://example.com');
  });

  it('does not change url that has other protocol', () => {
    expect(ensureProtocol('http', 'https://example.com')).to.eq('https://example.com');
  });

  it('ignores null', () => {
    expect(ensureProtocol('http', null)).to.eq(null);
  });
});
