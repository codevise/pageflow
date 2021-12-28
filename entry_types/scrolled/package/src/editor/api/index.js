import {editor as base} from 'pageflow/editor';
import {features} from 'pageflow/frontend';
import {ContentElementTypeRegistry} from './ContentElementTypeRegistry';

export function extend(api) {
  return Object.assign(api, {
    contentElementTypes: new ContentElementTypeRegistry({features})
  });
}

export const editor = extend(base);
