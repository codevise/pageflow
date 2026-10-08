import {isSameOriginMessage} from 'shared/isSameOriginMessage';

describe('isSameOriginMessage', () => {
  it('accepts message from own origin', () => {
    const message = new MessageEvent('message', {origin: window.location.origin});

    expect(isSameOriginMessage(message)).toEqual(true);
  });

  it('rejects message from origin that is a prefix of own origin', () => {
    const message = new MessageEvent('message', {
      origin: window.location.origin.slice(0, -1)
    });

    expect(isSameOriginMessage(message)).toEqual(false);
  });

  it('rejects message from origin that own origin is a prefix of', () => {
    const message = new MessageEvent('message', {
      origin: `${window.location.origin}.example.com`
    });

    expect(isSameOriginMessage(message)).toEqual(false);
  });
});
