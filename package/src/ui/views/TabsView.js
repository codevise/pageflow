/*global pageflow*/

import $ from 'jquery';
import Marionette from 'backbone.marionette';
import IScroll from 'iscroll';
import _ from 'underscore';

import {findTranslation} from '../utils/i18nUtils';

import template from '../templates/tabsView.jst';

/**
 * Switch between different views using tabs.
 *
 * @param {Object} [options]
 *
 * @param {string} [options.defaultTab]
 *   Name of the tab to enable by default.
 *
 * @param {string[]} [options.translationKeyPrefixes]
 *   List of prefixes to append tab name to. First exisiting translation is used as label.
 *
 * @param {string} [options.fallbackTranslationKeyPrefix]
 *   Translation key prefix to use if non of the `translationKeyPrefixes` result in an
 *   existing translation for a tab name.
 *
 * @param {string} [options.i18n]
 *   Legacy alias for `fallbackTranslationKeyPrefix`.
 *
 * @class
 */
export const TabsView = Marionette.Layout.extend(/* @lends TabView.prototype */{
  template,
  className: 'tabs_view',

  ui: {
    headers: '.tabs_view-headers',
    scroller: '.tabs_view-scroller'
  },

  regions: {
    container: '.tabs_view-container'
  },

  events: {
    'click .tabs_view-headers > li': function(event) {
      this.changeTab($(event.target).data('tab-name'));
    }
  },

  initialize: function() {
    this.tabFactoryFns = {};
    this.tabNames = [];
    this.currentTabName = null;

    this._refreshScrollerOnSideBarResize();
  },

  tab: function(name, factoryFn) {
    this.tabFactoryFns[name] = factoryFn;
    this.tabNames.push(name);
  },

  onRender: function() {
    _.each(this.tabNames, function(name) {
      var label = findTranslation(this._labelTranslationKeys(name));

      this.ui.headers.append(
        $('<li />')
          .attr('data-tab-name', name)
          .text(label)
      );
    }, this);

    this.scroller = new IScroll(this.ui.scroller[0], {
      scrollX: true,
      scrollY: false,
      bounce: false,
      mouseWheel: true,
      preventDefault: false,
    });

    this.changeTab(this.defaultTab());
  },

  changeTab: function(name) {
    this.container.show(this.tabFactoryFns[name]());
    this._updateActiveHeader(name);
    this.currentTabName = name;
  },

  defaultTab: function() {
    if (_.include(this.tabNames, this.options.defaultTab)) {
      return this.options.defaultTab;
    }
    else {
      return _.first(this.tabNames);
    }
  },

  /**
   * Rerender current tab.
   */
  refresh: function() {
    this.changeTab(this.currentTabName);
  },

  /**
   * Adjust tabs scroller to changed width of view.
   */
  refreshScroller: function() {
    this.scroller.refresh();
  },

  toggleSpinnerOnTab: function(name, visible) {
    this.$('[data-tab-name=' + name + ']').toggleClass('spinner', visible);
  },

  _labelTranslationKeys: function(name) {
    var result =_.map(this.options.translationKeyPrefixes, function(prefix) {
      return prefix + '.' + name;
    });

    if (this.options.i18n) {
      result.push(this.options.i18n + '.' + name);
    }

    if (this.options.fallbackTranslationKeyPrefix) {
      result.push(this.options.fallbackTranslationKeyPrefix + '.' + name);
    }

    return result;
  },

  _updateActiveHeader: function(activeTabName) {
    var scroller = this.scroller;

    this.ui.headers.children().each(function() {
      if ($(this).data('tab-name') === activeTabName) {
        scroller.scrollToElement(this, 200, true);
        $(this).addClass('active');
      }
      else {
        $(this).removeClass('active');
      }
    });
  },

  _refreshScrollerOnSideBarResize: function() {
    if (pageflow.app) {
      this.listenTo(pageflow.app, 'resize', function() {
        this.scroller.refresh();
      });
    }
  }
});
