import $ from 'jquery';
import {within} from '@testing-library/dom';

export const useHtmlSandbox = function(getTestContext) {
  let htmlSandbox;

  beforeEach(function() {
    htmlSandbox = $('<div />');
    getTestContext().htmlSandbox = htmlSandbox;
    $('body').append(htmlSandbox);
  });

  afterEach(function() {
    htmlSandbox.remove();
    htmlSandbox = null;
  });

  return {
    render(view) {
      htmlSandbox.append(view.el);
      return within(view.render().el);
    }
  };
};
