import {useFile, useAvailableQualities} from 'entryState';

import {renderHookInEntry} from 'support';

describe('useAvailableQualities', () => {
  it('includes auto option', () => {
    const {result} = renderHookInEntry(() =>
      useAvailableQualities(useFile({collectionName: 'videoFiles', permaId: 10})), {
      seed: {
        videoFiles: [{
          permaId: 10,
          variants: ['medium', 'fullhd']
        }]
      }
    });

    expect(result.current).toContain('auto');
  });

  it('returns empty array for null', () => {
    const {result} = renderHookInEntry(() =>
      useAvailableQualities(null), {
      seed: {
        videoFiles: []
      }
    });

    expect(result.current).toEqual([]);
  });

  it('includes present variants', () => {
    const {result} = renderHookInEntry(() =>
      useAvailableQualities(useFile({collectionName: 'videoFiles', permaId: 10})), {
        seed: {
          videoFiles: [{
            permaId: 10,
            variants: ['medium', 'fullhd', '4k']
          }]
        }
      });

    expect(result.current).toContain('medium');
    expect(result.current).toContain('fullhd');
    expect(result.current).toContain('4k');
  });

  it('does not include absent variants', () => {
    const {result} = renderHookInEntry(() =>
      useAvailableQualities(useFile({collectionName: 'videoFiles', permaId: 10})), {
        seed: {
          videoFiles: [{
            permaId: 10,
            variants: ['medium', 'fullhd']
          }]
        }
      });

    expect(result.current).not.toContain('4k');
  });

  it('ignores further variants', () => {
    const {result} = renderHookInEntry(() =>
      useAvailableQualities(useFile({collectionName: 'videoFiles', permaId: 10})), {
        seed: {
          videoFiles: [{
            permaId: 10,
            variants: ['medium', 'fullhd', 'poster']
          }]
        }
      });

    expect(result.current).not.toContain('poster');
  });
});
