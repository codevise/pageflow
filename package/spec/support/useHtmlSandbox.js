import $ from 'jquery';

export const useHtmlSandbox = function(getTestContext) {
  beforeEach(function() {
    getTestContext().htmlSandbox = $('<div />');
    $('body').append(getTestContext().htmlSandbox);
  });

  afterEach(function() {
    getTestContext().htmlSandbox.remove();
  });
};
