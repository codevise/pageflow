import $ from 'jquery';
import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {CollectionView} from '$pageflow/ui';

import {app} from '../app';

import {BlankEntryView} from './BlankEntryView';
import {PagePreviewView} from './PagePreviewView';

import {state} from '$state';

import template from '../templates/entryPreview.jst';

export const EntryPreviewView = Marionette.ItemView.extend({
  template,
  className: 'entry_preview',

  ui: {
    container: '> .container',
    header: '> .container > .header',
    entry: '> .container > .entry',
    overview: '> .container > .overview',
    navigationDisabledHint: '.navigation_disabled_hint'
  },

  initialize: function() {
    this.pages = this.model.pages.persisted();

    this.widgets = $();
    this.debouncedFetchWidgets = _.debounce(this.fetchWidgets, 200);
  },

  onRender: function() {
    this.pageViews = this.subview(new CollectionView({
      el: this.ui.entry,
      collection: this.pages,
      itemViewConstructor: PagePreviewView,
      blankSlateViewConstructor: BlankEntryView
    }));

    this.ui.entry.append($('#indicators_seed > *'));

    this.update();

    this.listenTo(state.entry, 'sync:order sync:widgets', this.update);
    this.listenTo(state.entry, 'change:configuration', function() {
      state.entry.once('sync', this.update, this);
    });
    this.listenTo(state.entry, 'change:emulation_mode', this.updateEmulationMode);

    this.listenTo(state.storylines, 'sync', this.update);
    this.listenTo(state.chapters, 'sync', this.update);
    this.listenTo(state.pages, 'sync', this.update);

    this.listenTo(state.audioFiles, 'sync', this.update);
    this.listenTo(state.imageFiles, 'sync', this.update);
    this.listenTo(state.videoFiles, 'sync', this.update);

    this.listenTo(pageflow.events, 'page:changing', function(event) {
      if (state.entry.get('emulation_mode')) {
        this.ui.navigationDisabledHint.css('opacity', 1);

        clearTimeout(this.navigationDisabledHintTimeout);
        this.navigationDisabledHintTimeout = setTimeout(_.bind(function() {
          this.ui.navigationDisabledHint.css('opacity', 0);
        }, this), 2000);

        event.cancel();
      }
    });

    this.listenTo(pageflow.events, 'page:change', function(page) {
      this.updateEmulationModeSupport(page.getPermaId());
    });
  },

  onShow: function() {
    var slideshow = pageflow.Slideshow.setup({
      element: this.ui.entry,
      enabledFeatureNames: state.entry.get('enabled_feature_names'),
      simulateHistory: true
    });

    pageflow.delayedStart.perform();

    this.listenTo(this.pages, 'add', function() {
      slideshow.update();
    });

    this.listenTo(this.pages, 'remove', function() {
      slideshow.update();
    });

    this.listenTo(this.pages, 'edit', function(model) {
      if (this.lastEditedPage != model) {
        state.entry.unset('emulation_mode');
      }

      this.lastEditedPage = model;

      slideshow.goTo(this.pageViews.itemViews.findByModel(model).$el);
    });

    this.listenTo(app, 'resize', function() {
      slideshow.triggerResizeHooks();
      this.updateSimulatedMediaQueryClasses();
    });

    this.listenTo(state.pages, 'change:template', function() {
      this.updateEmulationModeSupport(slideshow.currentPagePermaId());
    });

    this.updateSimulatedMediaQueryClasses();
  },

  updateEmulationModeSupport: function(permaId) {
    var model = state.pages.getByPermaId(permaId);

    state.entry.set('current_page_supports_emulation_mode',
                       model && model.pageType().supportsPhoneEmulation());
  },

  updateSimulatedMediaQueryClasses: function() {
    var width = this.ui.container.width();
    var height = this.ui.container.height();
    var portrait = width < height;

    $('html')
      .toggleClass('simulate_mobile', width <= 900)
      .toggleClass('simulate_phone', (portrait && width <= 500) || (!portrait && height <= 500))
      .toggleClass('simulate_desktop', (portrait && width > 500) || (!portrait && height > 500))
      .toggleClass('simulate_narrow_desktop', width <= 1200)
      .toggleClass('simulate_wide_desktop', width > 1600)
      .toggleClass('simulate_pad_portrait', width <= 768 && portrait)
      .toggleClass('simulate_phone_portrait', width <= 500 && portrait);
  },

  update: function() {
    this.debouncedFetchWidgets();

    this.$el.toggleClass('emphasize_chapter_beginning', !!this.model.configuration.get('emphasize_chapter_beginning'));
  },

  fetchWidgets: function() {
    var view = this;

    $.ajax('/entries/' + this.model.get('id') + '/partials').success(function(response) {
      var partials = $('<div />').html(response);

      view.ui.header.replaceWith(partials.find('> .header'));
      view.ui.overview.replaceWith(partials.find('> .overview'));
      view.bindUIElements();

      view.updateWidgets(partials);

      view.ui.header.header({
        slideshow: pageflow.slides
      });
      view.ui.overview.overview();
    });
  },

  updateWidgets: function(partials) {
    var widgets = partials.find('[data-widget]');
    this.updatePresentWidgetsCssClasses(widgets);

    this.widgets.remove();
    this.widgets = widgets;
    this.ui.entry.before(this.widgets);

    pageflow.widgetTypes.enhance(this.$el);
  },

  updatePresentWidgetsCssClasses: function(newWidgets) {
    var previousClasses = this.widgetNames(this.widgets);
    var newClasses = this.widgetNames(newWidgets);
    var removedClasses = _.difference(previousClasses, newClasses);
    var addedClasses = _.difference(newClasses, previousClasses);

    this.$el.addClass('widgets_present');
    this.$el.removeClass(removedClasses.join(' '));
    this.$el.addClass(addedClasses.join(' '));

    if (removedClasses.length || addedClasses.length) {
      pageflow.events.trigger('widgets:update');
    }
  },

  widgetNames: function(widgets) {
    return widgets.map(function() {
      return 'widget_' + $(this).data('widget') + '_present';
    }).get();
  },

  updateEmulationMode: function() {
    if (state.entry.previous('emulation_mode')) {
      this.$el.removeClass(this.emulationModeClassName(state.entry.previous('emulation_mode')));
    }

    if (state.entry.get('emulation_mode')) {
      this.$el.addClass(this.emulationModeClassName(state.entry.get('emulation_mode')));
    }

    app.trigger('resize');
  },

  emulationModeClassName: function(mode) {
    return 'emulation_mode_' + mode;
  }
});
