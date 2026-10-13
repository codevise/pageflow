import {useSelectLinkDestination} from 'frontend/inlineEditing/useSelectLinkDestination';

import {renderHook} from '@testing-library/react-hooks';
import {useFakeParentWindow} from 'support/fakeWindows';

describe('useSelectLinkDestination', () => {
  useFakeParentWindow();

  it('returns function that posts SELECT_LINK_DESTINATION message', () => {
    const {result} = renderHook(() => useSelectLinkDestination());
    const selectLinkDestination = result.current;
    selectLinkDestination().catch(() => {});

    expect(window.parent.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({type: 'SELECT_LINK_DESTINATION'}),
      expect.anything()
    );
  });

  it('passes current link and allowRemove option in SELECT_LINK_DESTINATION message', () => {
    const {result} = renderHook(() => useSelectLinkDestination());
    const selectLinkDestination = result.current;
    selectLinkDestination({href: {chapter: 10}}, {allowRemove: true}).catch(() => {});

    expect(window.parent.postMessage).toHaveBeenCalledWith(
      {
        type: 'SELECT_LINK_DESTINATION',
        payload: {link: {href: {chapter: 10}}, allowRemove: true}
      },
      expect.anything()
    );
  });

  it('returns function returns promise which resolves with null on LINK_DESTINATION_REMOVED message', () => {
    const {result} = renderHook(() => useSelectLinkDestination());
    const selectLinkDestination = result.current;
    const promise = selectLinkDestination({href: {chapter: 10}});

    window.postMessage({type: 'LINK_DESTINATION_REMOVED'}, '*');

    return expect(promise).resolves.toBeNull();
  });

  it('returns function returns promise which resolves on LINK_DESTINATION_SELECTED message', () => {
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
    const {result} = renderHook(() => useSelectLinkDestination());
    const selectLinkDestination = result.current;
    const promise = selectLinkDestination();
    selectLinkDestination().catch(() => {});

    return expect(promise).rejects.toEqual(undefined);
  });

  it('ignores other messages send to window', () => {
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
