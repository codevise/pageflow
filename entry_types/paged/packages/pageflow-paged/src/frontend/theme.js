export const theme = {
  mainColor: function() {
    var probe = document.getElementById('theme_probe-main_color');
    return window.getComputedStyle(probe)['background-color'];
  }
};
