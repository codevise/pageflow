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
    expect(fileRights).toMatchObject([{text: 'author A'},
                                      {text: 'author B'}]);
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
    expect(fileRights).toMatchObject([{text: 'default'}]);
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
    expect(fileRights).toMatchObject([{text: 'author1'},
                                      {text: 'author2'},
                                      {text: 'author3'}]);
  });

  it('skips files with empty rights if default file rights are not configured', () => {
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
    expect(fileRights).toMatchObject([{text: 'author2'}]);
  });

  it('returns empty array if no rights are defined', () => {
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
    expect(fileRights).toEqual([]);
  });

  it('returns empty array if no files are present', () => {
    const {result} = renderHookInEntry(
      () => useFileRights(), {
        seed: {
          defaultFileRights: 'default'
        }
      }
    );

    const fileRights = result.current;
    expect(fileRights).toEqual([]);
  });

  it('filters file configured for inline display', () => {
    const {result} = renderHookInEntry(
      () => useFileRights(), {
        seed: {
          imageFiles: [
            {rights: 'author1', configuration: {rights_display: 'inline'}},
            {rights: 'author2'}
          ]
        }
      }
    );

    const fileRights = result.current;
    expect(fileRights).toMatchObject([{text: 'author2'}]);
  });

  it('includes source urls', () => {
    const {result} = renderHookInEntry(
      () => useFileRights(), {
        seed: {
          imageFiles: [
            {rights: 'author1', configuration: {source_url: 'https://example.com/1'}},
            {rights: 'author2', configuration: {source_url: 'https://example.com/2'}}
          ]
        }
      }
    );

    const fileRights = result.current;
    expect(fileRights).toMatchObject([{text: 'author1', urls: ['https://example.com/1']},
                                      {text: 'author2', urls: ['https://example.com/2']}]);
  });

  it('ignores blank source_urls', () => {
    const {result} = renderHookInEntry(
      () => useFileRights(), {
        seed: {
          imageFiles: [
            {rights: 'author1', configuration: {source_url: ''}},
            {rights: 'author2', configuration: {source_url: ' '}},
            {rights: 'author3'}
          ]
        }
      }
    );

    const fileRights = result.current;
    expect(fileRights).toMatchObject([{text: 'author1', urls: []},
                                      {text: 'author2', urls: []},
                                      {text: 'author3', urls: []}]);
  });

  it('combines files with same rights but different sourceurls', () => {
    const {result} = renderHookInEntry(
      () => useFileRights(), {
        seed: {
          imageFiles: [
            {rights: 'author', configuration: {source_url: 'https://example.com/1'}},
            {rights: 'author', configuration: {source_url: 'https://example.com/2'}}
          ]
        }
      }
    );

    const fileRights = result.current;
    expect(fileRights).toMatchObject([{text: 'author',
                                       urls: ['https://example.com/1',
                                              'https://example.com/2']}]);
  });

  it('deduplicates source urls', () => {
    const {result} = renderHookInEntry(
      () => useFileRights(), {
        seed: {
          imageFiles: [
            {rights: 'author', configuration: {source_url: 'https://example.com/author'}},
            {rights: 'author', configuration: {source_url: 'https://example.com/author'}}
          ]
        }
      }
    );

    const fileRights = result.current;
    expect(fileRights).toMatchObject([{text: 'author',
                                       urls: ['https://example.com/author']}]);
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
    expect(fileRights).toMatchObject([{text: 'author 1'},
                                      {text: 'author 2'}]);
  });
});
