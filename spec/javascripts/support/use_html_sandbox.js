support.useHtmlSandbox = function() {
  beforeEach(function() {
    this.htmlSandbox = $('<div />');
    $('body').append(this.htmlSandbox);
  });

  afterEach(function() {
    this.htmlSandbox.remove();
  });
};