import {useIframeHeight} from 'contentElements/iframeEmbed/useIframeHeight';

import {renderHook} from '@testing-library/react-hooks';
import {asyncHandlingOf} from 'support/asyncHandlingOf/forHooks';

describe('useIframeHeight', () => {
  it('is undefined by default', async () => {
    const {result} = renderHook(() =>
      useIframeHeight({src: 'https://example.com/some/',
                       active: true})
    );

    expect(result.current).toEqual('400px');
  });

  it('sets height from message matching iframe location', async () => {
    const {result} = renderHook(() =>
      useIframeHeight({src: 'https://example.com/some/',
                       active: true})
    );

    await asyncHandlingOf(() => {
      window.postMessage(JSON.stringify({
        context: 'iframe.resize',
        height: 350,
        src: 'https://example.com/some/'
      }), '*');
    });

    expect(result.current).toEqual('350px');
  });

  it('removes listener on cleanup', async () => {
    const {result, unmount} = renderHook(() =>
      useIframeHeight({src: 'https://example.com/some/',
                       active: true})
    );

    unmount();
    await asyncHandlingOf(() => {
      window.postMessage(JSON.stringify({
        context: 'iframe.resize',
        height: 350,
        src: 'https://example.com/some/'
      }), '*');
    });

    expect(result.current).toEqual('400px');
  });

  it('ignores messages if src does not match', async () => {
    const {result} = renderHook(() =>
      useIframeHeight({src: 'https://example.com/some/',
                       active: true})
    );

    await asyncHandlingOf(() => {
      window.postMessage(JSON.stringify({
        context: 'iframe.resize',
        height: 350,
        src: 'https://example.com/other/'
      }), '*');
    });

    expect(result.current).toEqual('400px');
  });

  it('ignores messages if context is not iframe.resize', async () => {
    const {result} = renderHook(() =>
      useIframeHeight({src: 'https://example.com/some/',
                       active: true})
    );

    await asyncHandlingOf(() => {
      window.postMessage(JSON.stringify({
        context: 'whatever',
        height: 350,
        src: 'https://example.com/some/'
      }), '*');
    });

    expect(result.current).toEqual('400px');
  });

  it('ignores non-string messages', async () => {
    const {result} = renderHook(() =>
      useIframeHeight({src: 'https://example.com/some/',
                       active: true})
    );

    await asyncHandlingOf(() => {
      window.postMessage({
        some: 'value'
      }, '*');
    });

    expect(result.current).toEqual('400px');
  });

  it('ignores string messages that do not parse as JSON', async () => {
    const {result} = renderHook(() =>
      useIframeHeight({src: 'https://example.com/some/',
                       active: true})
    );

    await asyncHandlingOf(() => {
      window.postMessage('hello', '*');
    });

    expect(result.current).toEqual('400px');
  });

  it('ignores messages if not active', async () => {
    const {result} = renderHook(() =>
      useIframeHeight({src: 'https://example.com/some/',
                       active: false})
    );

    await asyncHandlingOf(() => {
      window.postMessage(JSON.stringify({
        context: 'iframe.resize',
        height: 350,
        src: 'https://example.com/some/'
      }), '*');
    });

    expect(result.current).toEqual('400px');
  });

  it('never regards undefined source as matching', async () => {
    const {result} = renderHook(() =>
      useIframeHeight({src: undefined,
                       active: true})
    );

    await asyncHandlingOf(() => {
      window.postMessage(JSON.stringify({
        context: 'iframe.resize',
        height: 350
      }), '*');
    });

    expect(result.current).toEqual('400px');
  });
});
