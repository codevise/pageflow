import {useCallback, useEffect, useRef} from 'react';

export function useFocusHandoff() {
  const ref1 = useRef();
  const ref2 = useRef();

  return [
    {sourceRef: ref1, targetRef: ref2, name: 'A'},
    {sourceRef: ref2, targetRef: ref1, name: 'B'}
  ];
}

export function usePassFocus(inert, {name, sourceRef, targetRef}) {
  const hasFocusRef = useRef();
  const passFocusRef = useRef();

  const setSourceRef = useCallback((source) => {
    if (sourceRef.current) {
      sourceRef.current.removeEventListener('focusin', updateHasFocus);
      sourceRef.current.removeEventListener('focusout', updateHasFocus);
    }

    sourceRef.current = source;

    if (sourceRef.current) {
      sourceRef.current.addEventListener('focusin', updateHasFocus);
      sourceRef.current.addEventListener('focusout', updateHasFocus);
    }

    function updateHasFocus(event) {
      hasFocusRef.current = event.type === 'focusin';
    }
  }, [sourceRef]);

  if (inert && hasFocusRef.current && !passFocusRef.current) {
    passFocusRef.current = true;
  }

  useEffect(() => {
    if (inert && passFocusRef.current && targetRef.current) {
      passFocusRef.current = false;

      if (targetRef.current.tagName === 'BUTTON') {
        targetRef.current.focus();
      }
      else {
        targetRef.current.querySelector('button').focus();
      }
    }
  }, [inert, targetRef, name]);

  return setSourceRef;
}
