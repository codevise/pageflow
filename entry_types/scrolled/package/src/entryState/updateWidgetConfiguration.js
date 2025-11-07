import {updateConfiguration} from '../collections';

export function updateWidgetConfiguration({dispatch, role, configuration}) {
  updateConfiguration({dispatch, name: 'widgets', key: role, configuration})
}
