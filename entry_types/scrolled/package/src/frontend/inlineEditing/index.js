import {provideExtensions} from '../extensionRegistry';

export function loadInlineEditingComponents() {
  return import('./extensions').then(({extensions}) => {
    provideExtensions(extensions);
  });
}
