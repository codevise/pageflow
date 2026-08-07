// Reserves the right box before the file has loaded, so the overlay
// does not jump into place around it. The attributes tell the browser
// which ratio to reserve. Passing the width to the stylesheet as well
// keeps it from scaling a small file up to the width of the sidebar.
export const filePreviewDimensions = {
  applyDimensions: function(element) {
    var width = this.model.get('width');
    var height = this.model.get('height');

    if (width && height) {
      element.attr({width, height});
      element[0].style.setProperty('--preview-width', width + 'px');
    }
  }
};
