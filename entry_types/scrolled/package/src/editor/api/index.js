import {editor as base} from 'pageflow/editor';
import {ContentElementTypeRegistry} from './ContentElementTypeRegistry';

export function extend(api) {
  return Object.assign(api, {
    contentElementTypes: new ContentElementTypeRegistry()
  });
}

export const editor = extend(base);
