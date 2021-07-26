import {getProviderName} from 'contentElements/videoEmbed/getProviderName';

describe('getProviderName', () => {
  it('recognizes YouTube urls', () => {
    expect(getProviderName('https://youtube.com/watch?v=234')).toEqual('youtube');
    expect(getProviderName('https://youtu.be/234')).toEqual('youtube');
  });

  it('recognizes Vimeo urls', () => {
    expect(
      getProviderName('https://vimeo.com/1234')
    ).toEqual('vimeo');
  });

  it('recognizes Facebook', () => {
    expect(
      getProviderName('https://www.facebook.com/videos/1234')
    ).toEqual('facebook');
  });

  it('returns null for empty string', () => {
    expect(
      getProviderName('')
    ).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(
      getProviderName(undefined)
    ).toBeNull();
  });
});
