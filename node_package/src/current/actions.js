export const PAGE_CHANGE = 'CURRENT_PAGE_CHANGE';

export function pageChange({id}) {
  return {
    type: PAGE_CHANGE,
    payload: {
      id
    }
  };
}
