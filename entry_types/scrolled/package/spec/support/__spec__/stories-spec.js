import {
  storiesOfContentElement,
  filePermaId,
  exampleStories,
  stubSeedFixture,
  normalizeAndMergeFixture
} from '../stories';

import {frontend} from 'pageflow-scrolled/frontend';
import 'pageflow-scrolled/contentElements-frontend';
import {normalizeSeed} from '../normalizeSeed';

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

  it('renders one story per example group by default', () => {
    const stories = exampleStories({typeName: 'test', baseConfiguration: {}});

    expect(stories).toContainEqual(expect.objectContaining({title: 'Layout'}));
  });

  it('supports splitting rendering one example per story', () => {
    process.env.STORYBOOK_SPLIT = true
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
