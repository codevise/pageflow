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
            accentColor: 'red'
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
                accentColor: 'red'
              })
            })
          })
        })
      }),
      cssProperties: {'--theme-accent-color': 'red'}
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
      requireConsentOptIn: true
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
})
