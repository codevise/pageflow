import {PageBackgroundImage} from 'components';
import PageBackgroundVideo from './PageBackgroundVideo';
import {playerState, playerActions} from 'media/selectors';

import {connectInPage} from 'pages';
import {pageAttributes} from 'pages/selectors';

import {combine, camelize} from 'utils';

export function PageBackgroundAsset({page,
                                     playerState, playerActions,
                                     propertyNamePrefix}) {

  const typePropertyName = camelize.concat(propertyNamePrefix, 'backgroundType');

  if (page[typePropertyName] == 'video') {
    return (
      <PageBackgroundVideo page={page}
                           playerState={playerState}
                           playerActions={playerActions}
                           propertyNamePrefix={propertyNamePrefix} />
    );
  }
  else {
    return (
      <PageBackgroundImage page={page}
                           propertyNamePrefix={propertyNamePrefix} />
    );
  }
}

export default connectInPage(
  combine({
    page: pageAttributes(),
    playerState: playerState({scope: 'background'})
  }),
  combine({
    playerActions: playerActions({scope: 'background'})
  })
)(PageBackgroundAsset);
