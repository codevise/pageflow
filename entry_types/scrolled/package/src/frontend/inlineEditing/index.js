import {provideExtensions} from '../extensionRegistry';

export function loadInlineEditingExtensions() {
  return import('./extensions').then(({extensions}) => {
    provideExtensions(extensions);
  });
}
