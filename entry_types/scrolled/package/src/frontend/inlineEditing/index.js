import {provideExtensions} from '../extensions';

export function loadInlineEditingComponents() {
  return import('./extensions').then(({extensions}) => {
    provideExtensions(extensions);
  });
}
