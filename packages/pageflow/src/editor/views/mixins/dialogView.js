export const dialogView = {
  events: {
    'click .close': function() {
      this.close();
    },

    'click .box': function() {
      return false;
    },

    'click': function() {
      this.close();
    }
  },
};