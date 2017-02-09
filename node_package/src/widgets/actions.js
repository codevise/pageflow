export const LOAD = 'WIDGETS_LOAD';

export function load({widgets}) {
  return {
    type: LOAD,
    payload: {
      widgets
    }
  };
}
