export const sectionChangeMessagePoster = (sectionIndex, excursionId) => {
  if (window.parent !== window) {
    window.parent.postMessage(
      {type: 'CHANGE_SECTION', payload: {sectionIndex, excursionId}},
      window.location.origin
    );
  }
};
