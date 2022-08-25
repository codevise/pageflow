import {useBackdrop} from 'frontend/useBackdrop';

import {renderHookInEntry} from 'support';

describe('useBackdrop', () => {
  it('sets files to null by default', () => {
    const {result} = renderHookInEntry(
      () => useBackdrop({
        backdrop: {}
      })
    );

    expect(result.current.file).toBeNull();
    expect(result.current.mobileFile).toBeNull();
  });

  it('looks up image file', () => {
    const {result} = renderHookInEntry(
      () => useBackdrop({
        backdrop: {image: 10}
      }),
      {
        seed: {
          imageFiles: [{id: 100, permaId: 10}]
        }
      }
    );

    expect(result.current.type).toEqual('image');
    expect(result.current.file.id).toEqual(100);
  });

  it('looks up mobile image file', () => {
    const {result} = renderHookInEntry(
      () => useBackdrop({
        backdrop: {image: 10, imageMobile: 11}
      }),
      {
        seed: {
          imageFiles: [
            {id: 100, permaId: 10},
            {id: 101, permaId: 11}
          ]
        }
      }
    );

    expect(result.current.file.id).toEqual(100);
    expect(result.current.mobileFile.id).toEqual(101);
  });

  it('falls back to mobile image if main image file is not present', () => {
    const {result} = renderHookInEntry(
      () => useBackdrop({
        backdrop: {imageMobile: 11}
      }),
      {
        seed: {
          imageFiles: [
            {id: 101, permaId: 11}
          ]
        }
      }
    );

    expect(result.current.file.id).toEqual(101);
    expect(result.current.mobileFile).toBeNull();
  });

  it('passes motif area as part of main image file', () => {
    const {result} = renderHookInEntry(
      () => useBackdrop({
        backdrop: {
          image: 10,
          imageMotifArea: {top: 0, left: 20, width: 30, height: 10}
        }
      }),
      {
        seed: {
          imageFiles: [{permaId: 10}]
        }
      }
    );

    expect(result.current.file.motifArea).toEqual(
      {top: 0, left: 20, width: 30, height: 10}
    );
  });

  it('passes motif area as part of mobile image file', () => {
    const {result} = renderHookInEntry(
      () => useBackdrop({
        backdrop: {
          image: 10,
          imageMotifArea: {top: 0, left: 20, width: 30, height: 10},
          imageMobile: 11,
          imageMobileMotifArea: {top: 10, left: 0, width: 50, height: 15}
        }
      }),
      {
        seed: {
          imageFiles: [
            {permaId: 10},
            {permaId: 11}
          ]
        }
      }
    );

    expect(result.current.mobileFile.motifArea).toEqual(
      {top: 10, left: 0, width: 50, height: 15}
    );
  });

  it('uses mobile motif area when falling back to mobile image file', () => {
    const {result} = renderHookInEntry(
      () => useBackdrop({
        backdrop: {
          imageMobile: 11,
          imageMobileMotifArea: {top: 10, left: 0, width: 50, height: 15}
        }
      }),
      {
        seed: {
          imageFiles: [
            {permaId: 11}
          ]
        }
      }
    );

    expect(result.current.file.motifArea).toEqual(
      {top: 10, left: 0, width: 50, height: 15}
    );
  });

  it('passes effects as part of main image file', () => {
    const {result} = renderHookInEntry(
      () => useBackdrop({
        backdrop: {
          image: 10
        },
        backdropEffects: [{name: 'blur', value: 50}]
      }),
      {
        seed: {
          imageFiles: [{permaId: 10}]
        }
      }
    );

    expect(result.current.file.effects).toEqual(
      [{name: 'blur', value: 50}]
    );
  });

  it('passes effects as part of mobile image file', () => {
    const {result} = renderHookInEntry(
      () => useBackdrop({
        backdrop: {
          image: 10,
          imageMobile: 11
        },
        backdropEffectsMobile: [{name: 'blur', value: 50}]
      }),
      {
        seed: {
          imageFiles: [
            {permaId: 10},
            {permaId: 11}
          ]
        }
      }
    );

    expect(result.current.mobileFile.effects).toEqual(
      [{name: 'blur', value: 50}]
    );
  });

  it('supports color as backdrop', () => {
    const {result} = renderHookInEntry(
      () => useBackdrop({backdrop: {color: '#f00'}})
    );

    expect(result.current.color).toEqual('#f00');
    expect(result.current.type).toEqual('color');
  });

  it('supports color via legacy image prop', () => {
    const {result} = renderHookInEntry(
      () => useBackdrop({backdrop: {image: '#f00'}})
    );

    expect(result.current.color).toEqual('#f00');
    expect(result.current.type).toEqual('color');
  });

  it('looks up video file', () => {
    const {result} = renderHookInEntry(
      () => useBackdrop({
        backdrop: {video: 10}
      }),
      {
        seed: {
          videoFiles: [{id: 100, permaId: 10}]
        }
      }
    );

    expect(result.current.type).toEqual('video');
    expect(result.current.file.id).toEqual(100);
  });

  it('passes motif area as part of video file', () => {
    const {result} = renderHookInEntry(
      () => useBackdrop({
        backdrop: {
          video: 10,
          videoMotifArea: {top: 0, left: 20, width: 30, height: 10}
        }
      }),
      {
        seed: {
          videoFiles: [{permaId: 10}]
        }
      }
    );

    expect(result.current.file.motifArea).toEqual(
      {top: 0, left: 20, width: 30, height: 10}
    );
  });

  it('passes effects as part of video file', () => {
    const {result} = renderHookInEntry(
      () => useBackdrop({
        backdrop: {
          video: 10
        },
        backdropEffects: [{name: 'blur', value: 50}]
      }),
      {
        seed: {
          videoFiles: [{permaId: 10}]
        }
      }
    );

    expect(result.current.file.effects).toEqual(
      [{name: 'blur', value: 50}]
    );
  });
});
