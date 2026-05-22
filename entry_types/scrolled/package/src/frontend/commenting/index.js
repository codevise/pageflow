import {provideExtensions} from '../extensionRegistry';

export function loadCommentingExtensions() {
  return import(/* webpackPreload: true */ './extensions').then(({extensions}) => {
    provideExtensions(extensions);
  });
}
