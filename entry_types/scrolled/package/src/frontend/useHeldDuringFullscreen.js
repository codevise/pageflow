import {useEffect, useRef, useState} from 'react';

import {useIsFullscreen} from './fullscreenState';
import {shallowEqual} from './utils/shallowEqual';

export function useHeldDuringFullscreen(value, {settleTimeout = 1000} = {}) {
  const isFullscreen = useIsFullscreen();
  const [state, setState] = useState({phase: 'idle', wasFullscreen: isFullscreen});
  const heldRef = useRef(value);

  let phase = state.phase;

  if (isFullscreen !== state.wasFullscreen) {
    phase = nextPhase(phase, isFullscreen);
    setState({phase, wasFullscreen: isFullscreen});
  }

  const settled = phase === 'settling' && shallowEqual(value, heldRef.current);

  useEffect(() => {
    if (state.phase !== 'settling') {
      return;
    }

    if (settled) {
      setState(current => ({...current, phase: 'idle'}));
      return;
    }

    const timeout = setTimeout(() => setState(current => ({...current, phase: 'idle'})),
                               settleTimeout);
    return () => clearTimeout(timeout);
  }, [state.phase, settled, settleTimeout]);

  if (phase === 'idle' || settled) {
    heldRef.current = value;
  }

  return heldRef.current;
}

function nextPhase(phase, isFullscreen) {
  if (isFullscreen) {
    return 'holding';
  }

  return phase === 'holding' ? 'settling' : phase;
}
