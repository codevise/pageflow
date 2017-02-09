export const ACTIVATE = 'HIDE_TEXT_ACTIVATE';
export const DEACTIVATE = 'HIDE_TEXT_DEACTIVATE';

export function activate() {
  return {
    type: ACTIVATE,
  };
}

export function deactivate() {
  return {
    type: DEACTIVATE,
  };
}
