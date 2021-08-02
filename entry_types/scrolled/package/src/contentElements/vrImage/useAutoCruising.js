import {useRef, useCallback, useEffect} from 'react';

export function useAutoCruising({viewerRef, onCancel}) {
  const autoCruisingRef = useRef(false);
  const rafIdRef = useRef();
  const lastYawRef = useRef(null);

  const start = useCallback(function() {
    let viewer = viewerRef.current;

    let start = new Date().getTime();
    let pitch = viewer.getPitch();
    let yaw = viewer.getYaw();
    let delta = 0;

    if (!autoCruisingRef.current) {
      rafIdRef.current = window.requestAnimationFrame(tick)
      autoCruisingRef.current = true;
    }

    function tick() {
      delta = (new Date().getTime() - start);

      if (autoCruisingRef.current &&
          lastYawRef.current !== null &&
          (Math.abs(pitch - viewer.getPitch()) > 0.1 ||
           Math.abs(lastYawRef.current - viewer.getYaw()) > 0.1)) {

        autoCruisingRef.current = false;
        lastYawRef.current = null;

        onCancel();
        return;
      }

      lastYawRef.current = yaw - (delta / 1000) % 360;

      viewer.lookAt({
        yaw: lastYawRef.current,
        pitch: pitch
      }, 0);

      autoCruisingRef.current && (rafIdRef.current = window.requestAnimationFrame(tick));
    }
  }, [viewerRef, onCancel]);

  const stop = useCallback(function() {
    window.cancelAnimationFrame(rafIdRef.current)

    autoCruisingRef.current = false;
    lastYawRef.current = null;
  }, []);

  useEffect(() => stop, [stop]);

  return [start, stop];
}
