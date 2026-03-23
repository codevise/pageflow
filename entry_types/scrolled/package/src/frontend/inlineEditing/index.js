import {importComponents} from './importComponents';
import {provideExtensions} from '../extensions';

export function loadInlineEditingComponents() {
  return importComponents().then(({extensions}) => {
    provideExtensions(extensions);
  });
}
