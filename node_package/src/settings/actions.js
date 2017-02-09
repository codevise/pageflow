export const LOAD = 'SETTINGS_LOAD';

export const UPDATE = 'SETTINGS_UPDATE';

export function load({settings}) {
  return {
    type: LOAD,
    payload: {
      settings
    }
  };
}

export function update({property, value}) {
  return {
    type: UPDATE,
    payload: {
      property,
      value
    }
  };
}
