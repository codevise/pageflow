import {updateConfiguration} from '../collections';

export function updateContentElementConfiguration({dispatch, permaId, configuration}) {
  updateConfiguration({dispatch, name: 'contentElements', key: permaId, configuration})
}
