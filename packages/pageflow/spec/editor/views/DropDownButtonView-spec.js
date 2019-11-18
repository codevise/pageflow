import $ from 'jquery';
import Backbone from 'backbone';

import {DropDownButtonView} from '$pageflow/editor';

import sinon from 'sinon';

describe('DropDownButtonView', () => {
  test('renders menu items for collection items', () => {
    var dropDownButtonView = new DropDownButtonView({
      items: new Backbone.Collection([
        {label: 'Item 1'},
        {label: 'Item 2'}
      ])
    });

    dropDownButtonView.render();
    var itemTexts = mapToText(dropDownButtonView.$el.find('ul li a'));

    expect(itemTexts).toEqual(['Item 1', 'Item 2']);
  });

  test('renders nested menu items', () => {
    var dropDownButtonView = new DropDownButtonView({
      items: new Backbone.Collection([
        {
          label: 'Group 1',
          items: new Backbone.Collection([
            {label: 'Item 1'},
            {label: 'Item 2'},
          ])
        }
      ])
    });

    dropDownButtonView.render();
    var itemTexts = mapToText(dropDownButtonView.$el.find('li li a'));

    expect(itemTexts).toEqual(['Item 1', 'Item 2']);
  });

  test('supports disabling items', () => {
    var dropDownButtonView = new DropDownButtonView({
      items: new Backbone.Collection([
        {label: 'Item 1', disabled: true},
        {label: 'Item 2'}
      ])
    });

    dropDownButtonView.render();
    var items = dropDownButtonView.$el.find('ul li');

    expect(items.eq(0)).to.have.$class('is_disabled');
    expect(items.eq(1)).not.to.have.$class('is_disabled');
  });

  test('supports checking items', () => {
    var dropDownButtonView = new DropDownButtonView({
      items: new Backbone.Collection([
        {label: 'Item 1', checked: true},
        {label: 'Item 2'}
      ])
    });

    dropDownButtonView.render();
    var items = dropDownButtonView.$el.find('ul li');

    expect(items.eq(0)).to.have.$class('is_checked');
    expect(items.eq(1)).not.to.have.$class('is_checked');
  });

  test('marks items whose model has a selected method', () => {
    var itemModels = new Backbone.Collection([
      {label: 'Item 1'},
      {label: 'Item 2'}
    ]);
    itemModels.first().selected = function() {};
    var dropDownButtonView = new DropDownButtonView({
      items: itemModels
    });

    dropDownButtonView.render();
    var items = dropDownButtonView.$el.find('ul li');

    expect(items.eq(0)).to.have.$class('is_selectable');
    expect(items.eq(1)).not.to.have.$class('is_selectable');
  });

  test('calls selected function on model when item is clicked', () => {
    var itemModels = new Backbone.Collection([
      {label: 'Item 1'}
    ]);
    var selectedHandler = sinon.spy();
    itemModels.first().selected = selectedHandler;
    var dropDownButtonView = new DropDownButtonView({
      items: itemModels
    });

    dropDownButtonView.render();
    dropDownButtonView.$el.find('ul li a').first().trigger('click');

    expect(selectedHandler).to.have.been.called;
  });

  test(
    'does not call selected method on model when disabled item is clicked',
    () => {
      var itemModels = new Backbone.Collection([
        {label: 'Item 1', disabled: true}
      ]);
      var selectedHandler = sinon.spy();
      itemModels.first().selected = selectedHandler;
      var dropDownButtonView = new DropDownButtonView({
        items: itemModels
      });

      dropDownButtonView.render();
      dropDownButtonView.$el.find('ul li a').first().trigger('click');

      expect(selectedHandler).not.to.have.been.called;
    }
  );

  function mapToText(el) {
    return el.map(function() {
      return $(this).text().trim();
    }).get();
  }
});