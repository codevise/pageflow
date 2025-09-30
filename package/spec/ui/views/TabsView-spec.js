import Backbone from 'backbone';
import {fireEvent, within} from '@testing-library/dom';

import {TabsView} from 'pageflow/ui';

import {useFakeTranslations, renderBackboneView} from '$support';

describe('TabsView', () => {
  describe('with i18n option', () => {
    useFakeTranslations({
      'tabs.one': 'Tab one',
      'tabs.two': 'Tab two'
    });

    it('uses prefix for tab labels', () => {
      var tabsView = new TabsView({
        i18n: 'tabs'
      });

      tabsView.tab('one', function() { return new Backbone.View(); });
      tabsView.tab('two', function() { return new Backbone.View(); });

      var {getAllByRole} = renderBackboneView(tabsView);
      var tabLabels = getAllByRole('tab').map(function(tab) {
        return tab.textContent;
      });

      expect(tabLabels).toEqual(['Tab one', 'Tab two']);
    });
  });

  describe('with fallbackTranslationKeyPrefix option', () => {
    useFakeTranslations({
      'tabs.one': 'Tab one',
      'tabs.two': 'Tab two'
    });

    it('uses prefix for tab labels', () => {
      var tabsView = new TabsView({
        fallbackTranslationKeyPrefix: 'tabs'
      });

      tabsView.tab('one', function() { return new Backbone.View(); });
      tabsView.tab('two', function() { return new Backbone.View(); });

      var {getAllByRole} = renderBackboneView(tabsView);
      var tabLabels = getAllByRole('tab').map(function(tab) {
        return tab.textContent;
      });

      expect(tabLabels).toEqual(['Tab one', 'Tab two']);
    });
  });

  describe('with translationKeyPrefixes option', () => {
    useFakeTranslations({
      'tabs.one': 'Tab one',
      'fallback.two': 'Tab two'
    });

    it('uses first present translation based', () => {
      var tabsView = new TabsView({
        translationKeyPrefixes: ['tabs', 'fallback']
      });

      tabsView.tab('one', function() { return new Backbone.View(); });
      tabsView.tab('two', function() { return new Backbone.View(); });

      var {getAllByRole} = renderBackboneView(tabsView);
      var tabLabels = getAllByRole('tab').map(function(tab) {
        return tab.textContent;
      });

      expect(tabLabels).toEqual(['Tab one', 'Tab two']);
    });
  });

  describe('with translationKeyPrefixes and fallbackTranslationKeyPrefix options', () => {
    useFakeTranslations({
      'tabs.one': 'Tab one',
      'fallback.two': 'Tab two'
    });

    it('uses first present translation based', () => {
      var tabsView = new TabsView({
        translationKeyPrefixes: ['tabs'],
        fallbackTranslationKeyPrefix: 'fallback'
      });

      tabsView.tab('one', function() { return new Backbone.View(); });
      tabsView.tab('two', function() { return new Backbone.View(); });

      var {getAllByRole} = renderBackboneView(tabsView);
      var tabLabels = getAllByRole('tab').map(function(tab) {
        return tab.textContent;
      });

      expect(tabLabels).toEqual(['Tab one', 'Tab two']);
    });
  });

  describe('accessibility', () => {
    useFakeTranslations({
      'tabs.one': 'Tab one',
      'tabs.two': 'Tab two'
    });

    function buildTabsView(options) {
      var tabsView = new TabsView(options || {});

      tabsView.tab('one', function() { return new Backbone.View(); });
      tabsView.tab('two', function() { return new Backbone.View(); });

      return tabsView;
    }

    it('marks only active tab as selected and focusable', () => {
      var tabsView = buildTabsView({i18n: 'tabs'});
      var {getByRole} = renderBackboneView(tabsView);
      var firstTab = getByRole('tab', {name: 'Tab one'});
      var secondTab = getByRole('tab', {name: 'Tab two'});

      expect(firstTab.getAttribute('aria-selected')).toEqual('true');
      expect(firstTab.getAttribute('tabindex')).toEqual('0');
      expect(secondTab.getAttribute('aria-selected')).toEqual('false');
      expect(secondTab.getAttribute('tabindex')).toEqual('-1');
    });

    it('associates active tabs with the panel via aria attributes', () => {
      var tabsView = buildTabsView({i18n: 'tabs'});
      var {getByRole} = renderBackboneView(tabsView);
      var firstTab = getByRole('tab', {name: 'Tab one'});
      var panel = getByRole('tabpanel');

      expect(firstTab.getAttribute('id')).toEqual(tabsView.cid + '-tab-one');
      expect(firstTab.getAttribute('aria-controls')).toEqual(tabsView.cid + '-panel');
      expect(panel.getAttribute('id')).toEqual(tabsView.cid + '-panel');
      expect(panel.getAttribute('aria-labelledby')).toEqual(firstTab.getAttribute('id'));
    });

    it('activates next tab on arrow key press', () => {
      var tabsView = buildTabsView({i18n: 'tabs'});
      var {getByRole} = renderBackboneView(tabsView);
      var firstTab = getByRole('tab', {name: 'Tab one'});

      fireEvent.keyDown(firstTab, {key: 'ArrowRight'});

      var secondTab = getByRole('tab', {name: 'Tab two'});
      var panel = getByRole('tabpanel');

      expect(secondTab.getAttribute('aria-selected')).toEqual('true');
      expect(secondTab.getAttribute('tabindex')).toEqual('0');
      expect(document.activeElement).toBe(secondTab);
      expect(panel.getAttribute('aria-labelledby')).toEqual(secondTab.getAttribute('id'));
    });
  });
});
