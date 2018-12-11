export const UPDATE = 'ENTRY_UPDATE';

export function init({entry}) {
  return {
    type: UPDATE,
    payload: {
      entry
    }
  };
}
