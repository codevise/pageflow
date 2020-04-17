import {connectInPage} from 'pages';
import {pageIsActive} from 'pages/selectors';
import {combineSelectors, memoizedSelector} from 'utils';

export default function(Component) {
  return connectInPage(combineSelectors({
    id: memoizedSelector(pageIsActive(), isActive => isActive ? 'firstContent' : undefined)
  }))(Component);
}
