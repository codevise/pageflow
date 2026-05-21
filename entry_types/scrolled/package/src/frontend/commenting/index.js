import {provideExtensions} from '../extensions';

export function loadCommentingComponents() {
  return import(/* webpackPreload: true */ './extensions').then(({extensions}) => {
    provideExtensions(extensions);
  });
}
