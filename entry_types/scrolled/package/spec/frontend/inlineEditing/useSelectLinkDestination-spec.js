import {useSelectLinkDestination} from 'frontend/inlineEditing/useSelectLinkDestination';

import {renderHook} from '@testing-library/react-hooks';
import {fakeParentWindow} from 'support';

describe('useSelectLinkDestination', () => {
  it('returns function that posts SELECT_LINK_DESTINATION message', () => {
    fakeParentWindow();
    window.parent.postMessage = jest.fn();

    const {result} = renderHook(() => useSelectLinkDestination());
    const selectLinkDestination = result.current;
    selectLinkDestination().catch(() => {});

    expect(window.parent.postMessage).toHaveBeenCalledWith(
      {type: 'SELECT_LINK_DESTINATION'},
      expect.anything()
    );
  });

  it('returns function returns promise which resolves on LINK_DESTINATION_SELECTED message', () => {
    fakeParentWindow();
    window.parent.postMessage = jest.fn();

    const {result} = renderHook(() => useSelectLinkDestination());
    const selectLinkDestination = result.current;
    const promise = selectLinkDestination();

    window.postMessage({
      type: 'LINK_DESTINATION_SELECTED',
      payload: {url: 'https://example.com'}
    }, '*');

    return expect(promise).resolves.toEqual({url: 'https://example.com'});
  });

  it('rejects promise on when function is called again', () => {
    fakeParentWindow();
    window.parent.postMessage = jest.fn();

    const {result} = renderHook(() => useSelectLinkDestination());
    const selectLinkDestination = result.current;
    const promise = selectLinkDestination();
    selectLinkDestination().catch(() => {});

    return expect(promise).rejects.toEqual(undefined);
  });

  it('ignores other messages send to window', () => {
    fakeParentWindow();
    window.parent.postMessage = jest.fn();

    const {result} = renderHook(() => useSelectLinkDestination());
    const selectLinkDestination = result.current;
    const promise = selectLinkDestination();

    window.postMessage({
      type: 'SOMETHING_ELSE',
      payload: {please: 'ignore'}
    }, '*');
    window.postMessage({
      type: 'LINK_DESTINATION_SELECTED',
      payload: {url: 'https://example.com'}
    }, '*');

    return expect(promise).resolves.toEqual({url: 'https://example.com'});
  });
});
