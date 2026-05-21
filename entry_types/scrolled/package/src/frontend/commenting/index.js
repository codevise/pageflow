import {provideExtensions} from '../extensionRegistry';

export function loadCommentingComponents() {
  return import(/* webpackPreload: true */ './extensions').then(({extensions}) => {
    provideExtensions(extensions);
  });
}
