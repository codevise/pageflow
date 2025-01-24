import {
  storiesOfContentElement,
  filePermaId,
  exampleStories,
  stubSeedFixture,
  normalizeAndMergeFixture
} from '../stories';

import {frontend} from 'pageflow-scrolled/frontend';
import 'pageflow-scrolled/contentElements-frontend';
import {normalizeSeed} from '../index';

import {storiesOf} from '@storybook/react';

jest.mock('@storybook/react');

frontend.contentElementTypes.register('test', {});

beforeEach(() => stubSeedFixture(normalizeSeed()));

describe('storiesOfContentElement', () => {
  let addStory;

  beforeEach(() => {
    addStory = jest.fn();
    storiesOf.mockReturnValue({add: addStory});
  });

  it('adds story for example seeds', () => {
    const module = {};

    storiesOfContentElement(module, {typeName: 'test', baseConfiguration: {}});

    expect(addStory).toHaveBeenCalledWith(expect.stringContaining('Layout'),
                                          expect.any(Function),
                                          expect.any(Object));
  });
});

describe('exampleStories', () => {
  it('uses config from seed fixture file', () => {
    const seedFixture = normalizeSeed({
      prettyUrl: 'https://example.com/'
    });
    stubSeedFixture(seedFixture);

    const stories = exampleStories({typeName: 'test', baseConfiguration: {}});

    expect(stories[0].seed).toMatchObject({config: seedFixture.config});
  });

  it('renders one story per example', () => {
    const stories = exampleStories({typeName: 'test', baseConfiguration: {}});

    expect(stories).toContainEqual(expect.objectContaining({title: 'Layout - Left'}));
  });

  it('supports adding stories for additional configurations', () => {
    const stories = exampleStories({
      typeName: 'test',
      baseConfiguration: {},
      variants: [{
        name: 'Extra',
        configuration: {
          extra: true
        }
      }]
    });

    expect(stories).toContainEqual(expect.objectContaining({title: 'Variants - Extra'}));
  });

  it('supports adding stories for different theme options', () => {
    const stories = exampleStories({
      typeName: 'test',
      baseConfiguration: {},
      variants: [{
        name: 'With Properties',
        themeOptions: {
          properties: {
            root: {
              accentColor: 'red'
            },
            dark: {
              accentColor: 'green'
            }
          },
          typography: {
            heading: {
              fontWeight: 'bold'
            }
          }
        }
      }]
    });

    expect(stories).toContainEqual(expect.objectContaining({
      title: 'Variants - With Properties',
      seed: expect.objectContaining({
        config: expect.objectContaining({
          theme: expect.objectContaining({
            options: expect.objectContaining({
              properties: expect.objectContaining({
                root: {
                  accentColor: 'red'
                }
              })
            })
          })
        })
      }),
      cssRules: {
        ':root': {
          '--theme-accent-color': 'red'
        },

        '.scope-dark': {
          '--theme-accent-color': 'green'
        },

        '.typography-heading': {
          'font-weight': 'bold'
        },
      }
    }));
  });

  it('does not include consent stories by default', () => {
    const stories = exampleStories({
      typeName: 'test',
      baseConfiguration: {}
    });

    expect(stories).not.toContainEqual(expect.objectContaining({
      requireConsentOptIn: true
    }));
  });

  it('supports adding story for when consent has not been given', () => {
    const stories = exampleStories({
      typeName: 'test',
      consent: true,
      baseConfiguration: {}
    });

    expect(stories).toContainEqual(expect.objectContaining({
      title: 'Consent - Opt-In',
      requireConsentOptIn: true,
      seed: expect.objectContaining({
        config: expect.objectContaining({
          consentVendors: [
            expect.objectContaining({name: 'test'})
          ],
          contentElementConsentVendors: {1000: 'test'}
        }),
        collections: expect.objectContaining({
          contentElements: expect.arrayContaining([
            expect.objectContaining({id: 1000})
          ])
        })
      })
    }));
  });

  it('supports adding story for inline file rights', () => {
    stubSeedFixture(normalizeSeed({
      imageFiles: [
        {id: 10, permaId: 1}
      ]
    }));

    const stories = exampleStories({
      typeName: 'test',
      inlineFileRights: true,
      baseConfiguration: {}
    });

    expect(stories).toContainEqual(expect.objectContaining({
      title: 'Inline File Rights - Icon',
      seed: expect.objectContaining({
        collections: expect.objectContaining({
          imageFiles: expect.arrayContaining([
            expect.objectContaining({
              configuration: expect.objectContaining({rights_display: 'inline'})
            })
          ]),
          widgets: [
            expect.objectContaining({
              role: 'inlineFileRights',
              typeName: 'iconInlineFileRights'
            })
          ],
          contentElements: expect.arrayContaining([
            expect.objectContaining({id: 1000})
          ])
        })
      })
    }));
  });
});

describe('filePermaId', () => {
  it('find file by test reference name', () => {
    stubSeedFixture(normalizeSeed({
      imageFiles: [{
        permaId: 17,
        configuration: {
          testReferenceName: 'tree'
        }
      }]
    }));

    expect(filePermaId('imageFiles', 'tree')).toBe(17)
  });
});

describe('normalizeAndMergeFixture', () => {
  it('supports merging custom theme options', () => {
    stubSeedFixture(normalizeSeed({
      themeOptions: {
        properties: {
          root: {
            widgetPrimaryColor: '#f00'
          }
        }
      }
    }));

    const seed = normalizeAndMergeFixture({themeOptions: {
      properties: {
        root: {
          narrowViewportBreakpoint: '600px'
        }
      }
    }});

    expect(seed.config.theme.options.properties.root).toMatchObject({
      narrowViewportBreakpoint: '600px',
      widgetPrimaryColor: '#f00'
    })
  });

  it('supports inline file rights', () => {
    stubSeedFixture(normalizeSeed({
      imageFiles: [
        {id: 10, permaId: 1}
      ]
    }));

    const seed = normalizeAndMergeFixture({inlineFileRightsFor: ['imageFiles']});

    expect(seed.collections.imageFiles[0]).toMatchObject({
      rights: 'Jane Doe',
      configuration: {
        rights_display: 'inline',
        source_url: 'https://example.com/jane-doe/image'
      }
    })
  });
})
