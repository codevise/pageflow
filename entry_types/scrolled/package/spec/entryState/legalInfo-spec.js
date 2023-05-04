import {useFileRights, useLegalInfo, useCredits, watchCollections} from 'entryState';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';

import {factories} from 'pageflow/testHelpers';
import {renderHookInEntry, normalizeSeed} from 'support';

describe('useLegalInfo', () => {
  const expectedLegalInfo = {
    imprint: {
      label: 'label',
      url: 'url'
    },
    copyright: {
      label: 'label',
      url: 'url'
    },
    privacy: {
      label: 'label',
      url: 'url'
    }
  };

  it('reads data from seed', () => {
    const {result} = renderHookInEntry(
      () => useLegalInfo(), {
        seed: {
          legalInfo: {
            imprint: {
              label: 'label',
              url: 'url'
            },
            copyright: {
              label: 'label',
              url: 'url'
            },
            privacy: {
              label: 'label',
              url: 'url'
            }
          }
        }
      }
    );

    const legalInfo = result.current;
    expect(legalInfo).toMatchObject(expectedLegalInfo);
  });
});

describe('useCredits', () => {
  it('reads data from seed', () => {
    const {result} = renderHookInEntry(
      () => useCredits(), {
        seed: {
          entry: {
            credits: 'Credits'
          }
        }
      }
    );

    const legalInfo = result.current;
    expect(legalInfo).toBe('Credits');
  });

  it('reads data from watched collections', () => {
    const {result} = renderHookInEntry(
      () => useCredits(), {
        setup: dispatch =>
          watchCollections(
            factories.entry(ScrolledEntry, {
              metadata: {
                credits: 'Credits'
              }
            }, {
              entryTypeSeed: normalizeSeed()
            }),
            {dispatch})
      });

    const legalInfo = result.current;
    expect(legalInfo).toBe('Credits');
  });
});

describe('useFileRights', () => {
  it('reads data from seed', () => {
    const {result} = renderHookInEntry(
      () => useFileRights(), {
        seed: {
          imageFiles: [
            {rights: 'author B'}
          ],
          videoFiles: [
            {rights: 'author A'}
          ]
        }
      }
    );

    const fileRights = result.current;
    expect(fileRights).toEqual('author A, author B');
  });

  it('returns comma separated list of file rights', () => {
    const {result} = renderHookInEntry(
      () => useFileRights(), {
        seed: {
          imageFiles: [
            {rights: 'author1'},
            {rights: 'author2'}
          ]
        }
      }
    );

    const fileRights = result.current;
    expect(fileRights).toEqual('author1, author2');
  });

  it('falls back to default file rights', () => {
    const {result} = renderHookInEntry(
      () => useFileRights(), {
        seed: {
          imageFiles: [
            {}
          ],
          defaultFileRights: 'default'
        }
      }
    );

    const fileRights = result.current;
    expect(fileRights).toEqual('default');
  });

  it('deduplicates file rights', () => {
    const {result} = renderHookInEntry(
      () => useFileRights(), {
        seed: {
          imageFiles: [
            {rights: 'author1'},
            {rights: 'author2'},
            {rights: 'author1'},
          ],
          videoFiles: [
            {rights: 'author2'},
            {rights: 'author3'},
          ],
          defaultFileRights: 'author1'
        }
      }
    );

    const fileRights = result.current;
    expect(fileRights).toEqual('author1, author2, author3');
  });

  it('does not insert extra comma if a file has no rights and defaults are not configured', () => {
    const {result} = renderHookInEntry(
      () => useFileRights(), {
        seed: {
          defaultFileRights: '',
          imageFiles: [
            {rights: ''},
            {rights: 'author2'}
          ]
        }
      }
    );

    const fileRights = result.current;
    expect(fileRights).toEqual('author2');
  });

  it('returns empty string if no rights are defined', () => {
    const {result} = renderHookInEntry(
      () => useFileRights(), {
        seed: {
          imageFiles: [
            {},
          ],
          defaultFileRights: ''
        }
      }
    );

    const fileRights = result.current;
    expect(fileRights).toEqual('');
  });

  it('returns empty string if no files are present', () => {
    const {result} = renderHookInEntry(
      () => useFileRights(), {
        seed: {
          defaultFileRights: 'default'
        }
      }
    );

    const fileRights = result.current;
    expect(fileRights).toEqual('');
  });

  it('reads data from watched collection', () => {
    const {result} = renderHookInEntry(
      () => useFileRights(),
      {
        seed: {
          defaultFileRights: 'default'
        },
        setup: (dispatch, entryTypeSeed) => {
          watchCollections(factories.entry(ScrolledEntry, {}, {
            entryTypeSeed,
            fileTypes: factories.fileTypes(function() {
              this.withImageFileType();
              this.withVideoFileType();
              this.withTextTrackFileType();
            }),
            filesAttributes: {
              image_files: [
                {
                  perma_id: 1,
                  rights: 'author 1'
                }
              ],
              video_files: [
                {
                  perma_id: 1,
                  rights: 'author 2'
                }
              ]
            }
          }), {dispatch})
        }
      }
    );

    const fileRights = result.current;
    expect(fileRights).toEqual('author 1, author 2');
  });
});
