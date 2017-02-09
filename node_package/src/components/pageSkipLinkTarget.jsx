import {connectInPage} from 'pages';
import {pageIsActive} from 'pages/selectors';
import {combine} from 'utils';
import {map} from 'utils/selectors';

export default function(Component) {
  return  connectInPage(combine({
    id: map(pageIsActive(), isActive => isActive ? 'firstContent' : undefined)
  }))(Component);
}
