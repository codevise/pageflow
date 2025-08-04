export const dialogView = {
  events: {
    'mousedown': function(event) {
      if (!event.target.closest(`.box`)) {
        this.close();
      }
    },

    'click .close': function() {
      this.close();
    },

    'click .box': function() {
      return false;
    },
  },
};
