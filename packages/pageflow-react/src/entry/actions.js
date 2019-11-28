export const UPDATE = 'ENTRY_UPDATE';
export const READY = 'ENTRY_READY';

export function update({entry}) {
  return {
    type: UPDATE,
    payload: {
      entry
    }
  };
}

export function ready() {
  return {
    type: READY
  };
}
