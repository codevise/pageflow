import {pageState} from 'pages/selectors';
import {memoizedSelector} from 'utils';

export const pageScrollerMarginBottom = memoizedSelector(
  pageState('media.pageScrollerMargin'),
  (pageState) => {
    return pageState && pageState.bottom;
  }
);
