import {useFileWithInlineRights} from 'entryState/useFileWithInlineRights';

import {renderHookInEntry} from 'support';

describe('useFileWithInlineRights', () => {
  it('returns file properties', () => {
    const {result} = renderHookInEntry(
      () => useFileWithInlineRights({
        configuration: {posterId: 10},
        collectionName: 'imageFiles',
        propertyName: 'posterId'
      }),
      {
        seed: {
          imageFiles: [{permaId: 10}]
        }
      }
    );

    expect(result.current.urls).toBeDefined();
  });

  it('returns null if file is missing', () => {
    const {result} = renderHookInEntry(
      () => useFileWithInlineRights({
        configuration: {},
        collectionName: 'imageFiles',
        propertyName: 'posterId'
      })
    );

    expect(result.current).toBeNull();
  });

  it('sets inlineRights to false by default', () => {
    const {result} = renderHookInEntry(
      () => useFileWithInlineRights({
        configuration: {posterId: 10},
        collectionName: 'imageFiles',
        propertyName: 'posterId'
      }),
      {
        seed: {
          imageFiles: [{permaId: 10}]
        }
      }
    );

    expect(result.current.inlineRights).toEqual(false);
  });

  it('sets inlineRights to true if file rights_display is inline', () => {
    const {result} = renderHookInEntry(
      () => useFileWithInlineRights({
        configuration: {posterId: 10},
        collectionName: 'imageFiles',
        propertyName: 'posterId'
      }),
      {
        seed: {
          imageFiles: [{
            permaId: 10,
            configuration: {rights_display: 'inline'}
          }]
        }
      }
    );

    expect(result.current.inlineRights).toEqual(true);
  });

  it('allows overriding inlineRights via configuration', () => {
    const {result} = renderHookInEntry(
      () => useFileWithInlineRights({
        configuration: {
          posterId: 10,
          posterInlineRightsHidden: true
        },
        collectionName: 'imageFiles',
        propertyName: 'posterId'
      }),
      {
        seed: {
          imageFiles: [{
            permaId: 10,
            configuration: {rights_display: 'inline'}
          }]
        }
      }
    );

    expect(result.current.inlineRights).toEqual(false);
  });

  it('can handle id property name', () => {
    const {result} = renderHookInEntry(
      () => useFileWithInlineRights({
        configuration: {
          id: 10,
          inlineRightsHidden: true
        },
        collectionName: 'imageFiles',
        propertyName: 'id'
      }),
      {
        seed: {
          imageFiles: [{
            permaId: 10,
            configuration: {rights_display: 'inline'}
          }]
        }
      }
    );

    expect(result.current.inlineRights).toEqual(false);
  });

  it('expands license information from config', () => {
    const {result} = renderHookInEntry(
      () => useFileWithInlineRights({
        configuration: {
          id: 10,
          inlineRightsHidden: true,
          license: 'cc_by_4'
        },
        collectionName: 'imageFiles',
        propertyName: 'id'
      }),
      {
        seed: {
          imageFiles: [{
            permaId: 10,
            configuration: {
              license: 'cc_by_4',
              rights_display: 'inline'
            }
          }],
          fileLicenses: {
            cc_by_4: {
              name: 'CC-BY 4.0',
              url: 'https://creativecommons.org/licenses/by/4.0/'
            }
          }
        }
      }
    );

    expect(result.current.license.name).toEqual('CC-BY 4.0');
    expect(result.current.license.url).toEqual('https://creativecommons.org/licenses/by/4.0/');
  });
});
