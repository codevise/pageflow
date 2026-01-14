import $ from 'jquery';
import Backbone from 'backbone';

import {DropDownButtonView} from 'pageflow/editor';

import {renderBackboneView as render} from 'pageflow/testHelpers';
import sinon from 'sinon';

describe('DropDownButtonView', () => {
  it('supports setting a title on the button', () => {
    var dropDownButtonView = new DropDownButtonView({
      title: 'Some title',
      items: new Backbone.Collection([
        {label: 'Item 1'},
        {label: 'Item 2'}
      ])
    });

    const {getByTitle} = render(dropDownButtonView);

    expect(getByTitle('Some title')).not.toBeNull();
  });

  it('renders menu items for collection items', () => {
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

  it('renders nested menu items', () => {
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

  it('supports disabling items', () => {
    var dropDownButtonView = new DropDownButtonView({
      items: new Backbone.Collection([
        {label: 'Item 1', disabled: true},
        {label: 'Item 2'}
      ])
    });

    dropDownButtonView.render();
    var items = dropDownButtonView.$el.find('ul li');

    expect(items.eq(0)).toHaveClass('is_disabled');
    expect(items.eq(1)).not.toHaveClass('is_disabled');
  });

  it('supports hiding items', () => {
    var dropDownButtonView = new DropDownButtonView({
      items: new Backbone.Collection([
        {label: 'Item 1', hidden: true},
        {label: 'Item 2'}
      ])
    });

    dropDownButtonView.render();
    var renderedItems = dropDownButtonView.$el.find('ul li');

    expect(renderedItems.eq(0)).toHaveClass('is_hidden');
    expect(renderedItems.eq(1)).not.toHaveClass('is_hidden');
  });

  it('supports hiding items dynamically', () => {
    const items = new Backbone.Collection([
      {label: 'Item 1'},
      {label: 'Item 2'}
    ])
    var dropDownButtonView = new DropDownButtonView({
      items
    });

    dropDownButtonView.render();
    items.first().set('hidden', true);
    var renderedItems = dropDownButtonView.$el.find('ul li');

    expect(renderedItems.eq(0)).toHaveClass('is_hidden');
    expect(renderedItems.eq(1)).not.toHaveClass('is_hidden');
  });

  it('supports checking items', () => {
    var dropDownButtonView = new DropDownButtonView({
      items: new Backbone.Collection([
        {label: 'Item 1', checked: true},
        {label: 'Item 2'}
      ])
    });

    dropDownButtonView.render();
    var items = dropDownButtonView.$el.find('ul li');

    expect(items.eq(0)).toHaveClass('is_checked');
    expect(items.eq(1)).not.toHaveClass('is_checked');
  });

  it('marks items whose model has a selected method', () => {
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

    expect(items.eq(0)).toHaveClass('is_selectable');
    expect(items.eq(1)).not.toHaveClass('is_selectable');
  });

  it('calls selected function on model when item is clicked', () => {
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

    expect(selectedHandler).toHaveBeenCalled();
  });

  it(
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

      expect(selectedHandler).not.toHaveBeenCalled();
    }
  );

  it('supports displaying separator above item', () => {
    var dropDownButtonView = new DropDownButtonView({
      items: new Backbone.Collection([
        {label: 'Item 1'},
        {label: 'Item 2', separated: true}
      ])
    });

    dropDownButtonView.render();
    var items = dropDownButtonView.$el.find('ul li');

    expect(items.eq(0)).not.toHaveClass('separated');
    expect(items.eq(1)).toHaveClass('separated');
  });

  it('supports marking items as destructive', () => {
    var dropDownButtonView = new DropDownButtonView({
      items: new Backbone.Collection([
        {label: 'Item 1'},
        {label: 'Item 2', destructive: true}
      ])
    });

    dropDownButtonView.render();
    var items = dropDownButtonView.$el.find('ul li');

    expect(items.eq(0)).not.toHaveClass('is_destructive');
    expect(items.eq(1)).toHaveClass('is_destructive');
  });

  function mapToText(el) {
    return el.map(function() {
      return $(this).text().trim();
    }).get();
  }
});
