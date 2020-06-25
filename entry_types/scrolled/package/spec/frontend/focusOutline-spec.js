import {useFocusOutlineVisible, FocusOutlineProvider} from 'frontend/focusOutline';
import styles from 'frontend/focusOutline.module.css';

import {renderHook, act} from '@testing-library/react-hooks';
import {fireEvent} from '@testing-library/dom';

describe('focus outline', () => {
  it('is hidden by default', () => {
    const {result} = renderHook(() => useFocusOutlineVisible(),
                                {wrapper: FocusOutlineProvider});

    expect(document.body.classList.contains(styles.focusOutlineDisabled)).toBe(true)
    expect(result.current).toBe(false);
  });

  it('is enabled after keyboard event', () => {
    const {result} = renderHook(() => useFocusOutlineVisible(),
                                {wrapper: FocusOutlineProvider});

    act(() => { fireEvent.keyDown(document.body); });

    expect(document.body.classList.contains(styles.focusOutlineDisabled)).toBe(false)
    expect(result.current).toBe(true);
  });

  it('is disabled focus after mouse event', () => {
    const {result} = renderHook(() => useFocusOutlineVisible(),
                                {wrapper: FocusOutlineProvider});

    act(() => { fireEvent.keyDown(document.body); });
    act(() => { fireEvent.mouseDown(document.body); });

    expect(document.body.classList.contains(styles.focusOutlineDisabled)).toBe(true)
    expect(result.current).toBe(false);
  });
});
