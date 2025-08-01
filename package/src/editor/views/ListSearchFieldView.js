import Marionette from 'backbone.marionette';
import $ from 'jquery';

import template from '../templates/listSearchField.jst';

export const ListSearchFieldView = Marionette.ItemView.extend({
  template,
  className: 'list_search_field',

  ui: {
    input: '.list_search_field-term',
  },

  events: {
    'input .list_search_field-term': 'changeTerm',
    'click .list_search_field-reset': 'reset',
    'keydown .list_search_field-term': 'handleInputKeyDown',
    'focus .list_search_field-term': 'handleInputFocus',
    'blur .list_search_field-term': 'handleInputBlur'
  },

  initialize(options = {}) {
    this.search = options.search;
    this.listHighlight = options.listHighlight;
  },

  onRender() {
    this.toggleReset();

    if (this.options.ariaControlsId) {
      this.ui.input.attr('aria-controls', this.options.ariaControlsId);
    }

    this.handleDocumentKeyDown = this.handleDocumentKeyDown.bind(this);
    $(document).on('keydown', this.handleDocumentKeyDown);

    if (this.options.autoFocus) {
      setTimeout(() => this.ui.input.focus(), 0);
    }
  },

  onClose() {
    $(document).off('keydown', this.handleDocumentKeyDown);
  },

  changeTerm() {
    this.search.set('term', this.ui.input.val());
    this.toggleReset();
  },

  reset(event) {
    this.ui.input.val('');
    this.search.set('term', '');
    this.toggleReset();

    this.ui.input.focus();

    if (event) {
      event.preventDefault();
    }
  },

  handleDocumentKeyDown(event) {
    const active = document.activeElement;

    if (event.key === '/' && !/input|textarea/i.test(active.tagName)) {
      this.ui.input.focus();
      event.preventDefault();
    }
  },

  handleInputKeyDown(event) {
    if (event.key === 'Escape') {
      if (this.search.get('term')) {
        this.reset();
      }
      else {
        this.ui.input.blur();
      }
    }
    else if (this.listHighlight) {
      if (event.key === 'ArrowDown') {
        this.listHighlight.next();
        event.preventDefault();
      }
      else if (event.key === 'ArrowUp') {
        this.listHighlight.previous();
        event.preventDefault();
      }
      else if (event.key === 'Enter') {
        this.listHighlight.triggerSelect();
      }
    }
  },

  handleInputFocus() {
    this.$el.addClass('focus');

    if (this.listHighlight) {
      this.listHighlight.set('active', true);
    }
  },

  handleInputBlur() {
    this.$el.removeClass('focus');

    if (this.listHighlight) {
      this.listHighlight.set('active', false);
    }
  },

  toggleReset() {
    this.$el.toggleClass('has_value', !!this.search.get('term'));
  }
});
