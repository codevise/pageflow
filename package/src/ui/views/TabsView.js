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
    tabs: '.tabs_view-tabs',
    scroller: '.tabs_view-scroller',
    container: '.tabs_view-container'
  },

  regions: {
    container: '.tabs_view-container'
  },

  events: {
    'click .tabs_view-tab': function(event) {
      this.changeTab($(event.currentTarget).data('tab-name'));
    },

    'keydown .tabs_view-tab': function(event) {
      this._handleKeyDown(event);
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
      var tabId = this._tabId(name);
      var button = $('<button />')
        .attr('type', 'button')
        .attr('role', 'tab')
        .attr('id', tabId)
        .attr('data-tab-name', name)
        .attr('tabindex', '-1')
        .attr('aria-selected', 'false')
        .addClass('tabs_view-tab')
        .text(label);

      this.ui.tabs.append(button);
    }, this);

    this.ui.container
      .attr('id', this._panelId())
      .attr('role', 'tabpanel');

    this.scroller = new IScroll(this.ui.scroller[0], {
      scrollX: true,
      scrollY: false,
      bounce: false,
      mouseWheel: true,
      preventDefault: false,
    });

    this.changeTab(this.defaultTab(), {refresh: true});
  },

  changeTab: function(name, options = {}) {
    if (!this.tabFactoryFns[name]) {
      return;
    }

    if (this.currentTabName !== name || options.refresh) {
      this.container.show(this.tabFactoryFns[name]());
    }

    this.currentTabName = name;

    this._updateActiveTab(name, options.focusTab);
    this._updateActivePanel(name);
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
    if (this.currentTabName) {
      this.changeTab(this.currentTabName, {refresh: true});
    }
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

  _updateActiveTab: function(activeTabName, focusTab) {
    var scroller = this.scroller;
    var panelId = this._panelId();

    this.ui.tabs.children().each(function() {
      var button = $(this);
      var isActive = button.data('tab-name') === activeTabName;

      if (isActive) {
        scroller.scrollToElement(this, 200, true);
        button.addClass('active');
        button.attr('aria-selected', 'true');
        button.attr('aria-controls', panelId);
        button.attr('tabindex', '0');

        if (focusTab) {
          button.focus();
        }
      }
      else {
        button.removeClass('active');
        button.attr('aria-selected', 'false');
        button.attr('tabindex', '-1');
      }
    });
  },

  _updateActivePanel: function(activeTabName) {
    this.ui.container.attr('aria-labelledby', this._tabId(activeTabName));
  },

  _handleKeyDown: function(event) {
    var tabName = $(event.currentTarget).data('tab-name');
    var nextTabName;

    switch (event.key) {
    case 'ArrowLeft':
    case 'ArrowUp':
      nextTabName = this._previousTabName(tabName);
      break;
    case 'ArrowRight':
    case 'ArrowDown':
      nextTabName = this._nextTabName(tabName);
      break;
    case 'Home':
      nextTabName = _.first(this.tabNames);
      break;
    case 'End':
      nextTabName = _.last(this.tabNames);
      break;
    case 'Enter':
    case ' ':
      nextTabName = tabName;
      break;
    default:
      return;
    }

    event.preventDefault();

    if (nextTabName) {
      this.changeTab(nextTabName, {focusTab: true});
    }
  },

  _previousTabName: function(currentTabName) {
    var currentIndex = _.indexOf(this.tabNames, currentTabName);
    var previousIndex = (currentIndex - 1 + this.tabNames.length) % this.tabNames.length;

    return this.tabNames[previousIndex];
  },

  _nextTabName: function(currentTabName) {
    var currentIndex = _.indexOf(this.tabNames, currentTabName);
    var nextIndex = (currentIndex + 1) % this.tabNames.length;

    return this.tabNames[nextIndex];
  },

  _refreshScrollerOnSideBarResize: function() {
    if (pageflow.app) {
      this.listenTo(pageflow.app, 'resize', function() {
        this.scroller.refresh();
      });
    }
  },

  _tabId: function(name) {
    return this.cid + '-tab-' + name;
  },

  _panelId: function() {
    return this.cid + '-panel';
  }
});
