import BackgroundImage from './BackgroundImage';

import {connectInPage} from 'pages';
import {pageIsPreloaded} from 'pages/selectors';
import {combine} from 'utils';

export default connectInPage(combine({
  loaded: pageIsPreloaded()
}))(BackgroundImage);
