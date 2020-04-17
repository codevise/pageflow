export const SET_BOTTOM = 'MEDIA_PAGE_SCROLLER_MARGIN_SET_BOTTOM';

export function setPageScrollerMarginBottom(value) {
  return {
    type: SET_BOTTOM,
    payload: {
      value
    },
    meta: {
      collectionName: 'pages'
    }
  };
}
