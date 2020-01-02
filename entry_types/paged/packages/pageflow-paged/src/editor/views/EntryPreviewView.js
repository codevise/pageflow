import $ from 'jquery';
import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {CollectionView} from 'pageflow/ui';

import {app} from 'pageflow/editor';
import {events} from 'pageflow/frontend';
import {delayedStart, Slideshow, widgetTypes} from 'pageflow-paged/frontend';

import {BlankEntryView} from './BlankEntryView';
import {PagePreviewView} from './PagePreviewView';

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

    this.listenTo(this.model, 'sync:order sync:widgets', this.update);
    this.listenTo(this.model, 'change:metadata', function() {
      this.model.once('sync', this.update, this);
    });
    this.listenTo(this.model, 'change:emulation_mode', this.updateEmulationMode);

    this.listenTo(this.model.storylines, 'sync', this.update);
    this.listenTo(this.model.chapters, 'sync', this.update);
    this.listenTo(this.model.pages, 'sync', this.update);

    this.listenTo(this.model.audioFiles, 'sync', this.update);
    this.listenTo(this.model.imageFiles, 'sync', this.update);
    this.listenTo(this.model.videoFiles, 'sync', this.update);

    this.listenTo(events, 'page:changing', function(event) {
      if (this.model.get('emulation_mode')) {
        this.ui.navigationDisabledHint.css('opacity', 1);

        clearTimeout(this.navigationDisabledHintTimeout);
        this.navigationDisabledHintTimeout = setTimeout(_.bind(function() {
          this.ui.navigationDisabledHint.css('opacity', 0);
        }, this), 2000);

        event.cancel();
      }
    });

    this.listenTo(events, 'page:change', function(page) {
      this.updateEmulationModeSupport(page.getPermaId());
    });
  },

  onShow: function() {
    var slideshow = this.slideshow = Slideshow.setup({
      element: this.ui.entry,
      enabledFeatureNames: this.model.get('enabled_feature_names'),
      simulateHistory: true
    });

    delayedStart.perform();

    this.listenTo(this.pages, 'add', function() {
      slideshow.update();
    });

    this.listenTo(this.pages, 'remove', function() {
      slideshow.update();
    });

    this.listenTo(this.pages, 'edit', function(model) {
      if (this.lastEditedPage != model) {
        this.model.unset('emulation_mode');
      }

      this.lastEditedPage = model;

      slideshow.goTo(this.pageViews.itemViews.findByModel(model).$el);
    });

    this.listenTo(app, 'resize', function() {
      slideshow.triggerResizeHooks();
      this.updateSimulatedMediaQueryClasses();
    });

    this.listenTo(this.model.pages, 'change:template', function() {
      this.updateEmulationModeSupport(slideshow.currentPagePermaId());
    });

    this.updateSimulatedMediaQueryClasses();
  },

  updateEmulationModeSupport: function(permaId) {
    var model = this.model.pages.getByPermaId(permaId);

    this.model.set('emulation_mode_disabled',
                       !model || !model.pageType().supportsPhoneEmulation());
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

    this.$el.toggleClass('emphasize_chapter_beginning', !!this.model.metadata.get('emphasize_chapter_beginning'));
  },

  fetchWidgets: function() {
    var view = this;

    $.ajax(this.model.url() + '/paged/partials').success(function(response) {
      var partials = $('<div />').html(response);

      view.ui.header.replaceWith(partials.find('> .header'));
      view.ui.overview.replaceWith(partials.find('> .overview'));
      view.bindUIElements();

      view.updateWidgets(partials);

      view.ui.header.header({
        slideshow: view.slideshow
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

    widgetTypes.enhance(this.$el);
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
      events.trigger('widgets:update');
    }
  },

  widgetNames: function(widgets) {
    return widgets.map(function() {
      return 'widget_' + $(this).data('widget') + '_present';
    }).get();
  },

  updateEmulationMode: function() {
    if (this.model.previous('emulation_mode')) {
      this.$el.removeClass(this.emulationModeClassName(this.model.previous('emulation_mode')));
    }

    if (this.model.get('emulation_mode')) {
      this.$el.addClass(this.emulationModeClassName(this.model.get('emulation_mode')));
    }

    app.trigger('resize');
  },

  emulationModeClassName: function(mode) {
    return 'emulation_mode_' + mode;
  }
});
