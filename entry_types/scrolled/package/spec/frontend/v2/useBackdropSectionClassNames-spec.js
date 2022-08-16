import {useBackdropSectionClassNames} from 'frontend/v2/useBackdropSectionClassNames';
import {useBackdropFile} from 'frontend/v2/useBackdrop';

import {renderHookInEntry} from 'support';

import styles from 'frontend/v2/Section.module.css';

describe('useBackdropSectionClassNames', () => {
  it('returns only section class by default', () => {
    const {result} = renderHookInEntry(
      () => useBackdropSectionClassNames({
        file: null
      })
    );

    expect(result.current).toEqual([styles.section]);
  });

  it('includes aspect ratio class name for file', () => {
    const {result} = renderHookInEntry(
      () => useBackdropSectionClassNames({
        file: useBackdropFile({collectionName: 'imageFiles', permaId: 10})
      }),
      {
        seed: {
          imageFiles: [{id: 100, permaId: 10, width: 400, height: 300}]
        }
      }
    );

    expect(result.current).toContain('aspectRatio1333');
  });

  it('includes aspect ratio class name for mobile file', () => {
    const {result} = renderHookInEntry(
      () => useBackdropSectionClassNames({
        file: useBackdropFile({collectionName: 'imageFiles', permaId: 10}),
        mobileFile: useBackdropFile({collectionName: 'imageFiles', permaId: 11})
      }),
      {
        seed: {
          imageFiles: [
            {id: 100, permaId: 10, width: 400, height: 300},
            {id: 101, permaId: 11, width: 300, height: 400}
          ]
        }
      }
    );

    expect(result.current).toContain('aspectRatio1333');
    expect(result.current).toContain('aspectRatioMobile750');
  });
});
