export const sectionChangeMessagePoster = (index) => {
  if (window.parent !== window) {
    window.parent.postMessage(
      {type: 'CHANGE_SECTION', payload: {index}},
      window.location.origin
    );
  }
};
