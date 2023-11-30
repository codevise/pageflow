import {InlineFileRightsMenuItem} from 'editor/models/InlineFileRightsMenuItem';

import Backbone from 'backbone';
import {factories} from 'support';

describe('InlineFileRightsDropDownMenuItem', () => {
  it('is hidden by default', () => {
    const propertyName = 'file';
    const file = factories.imageFile({rights: 'Some artist'});
    const inputModel = new Backbone.Model();

    const item = new InlineFileRightsMenuItem({}, {inputModel, propertyName, file});

    expect(item.get('hidden')).toEqual(true);
  });

  it('is not hidden if selected file displays rights inline', () => {
    const propertyName = 'file';
    const file = factories.imageFile({rights: 'Some artist',
                                      configuration: {rights_display: 'inline'}});
    const inputModel = new Backbone.Model();

    const item = new InlineFileRightsMenuItem({}, {inputModel, propertyName, file});

    expect(item.get('hidden')).toEqual(false);
  });

  it('is hidden if file rights are empty', () => {
    const propertyName = 'file';
    const file = factories.imageFile({rights: '', configuration: {rights_display: 'inline'}});
    const inputModel = new Backbone.Model();

    const item = new InlineFileRightsMenuItem({}, {inputModel, propertyName, file});

    expect(item.get('hidden')).toEqual(true);
  });

  it('is unchecked by default', () => {
    const propertyName = 'file';
    const file = factories.imageFile({rights: 'Some artist',
                                      configuration: {rights_display: 'inline'}});
    const inputModel = new Backbone.Model();

    const item = new InlineFileRightsMenuItem({}, {inputModel, propertyName, file});

    expect(item.get('checked')).toEqual(false);
  });

  it('is checked if property to hide inline rights is set on input model', () => {
    const propertyName = 'file';
    const file = factories.imageFile({rights: 'Some artist',
                                      configuration: {rights_display: 'inline'}});
    const inputModel = new Backbone.Model({fileInlineRightsHidden: true});

    const item = new InlineFileRightsMenuItem({}, {inputModel, propertyName, file});

    expect(item.get('checked')).toEqual(true);
  });

  it('toggles property when selected', () => {
    const propertyName = 'file';
    const file = factories.imageFile({rights: 'Some artist',
                                      configuration: {rights_display: 'inline'}});
    const inputModel = new Backbone.Model();

    const item = new InlineFileRightsMenuItem({}, {inputModel, propertyName, file});
    item.selected();

    expect(inputModel.get('fileInlineRightsHidden')).toEqual(true);
    expect(item.get('checked')).toEqual(true)

    item.selected();

    expect(inputModel.get('fileInlineRightsHidden')).toEqual(false);
    expect(item.get('checked')).toEqual(false)
  });

  it('drops Id suffix from property name', () => {
    const propertyName = 'posterId';
    const file = factories.imageFile({rights: 'Some artist',
                                      configuration: {rights_display: 'inline'}});
    const inputModel = new Backbone.Model();

    const item = new InlineFileRightsMenuItem({}, {inputModel, propertyName, file});
    item.selected();

    expect(inputModel.get('posterInlineRightsHidden')).toEqual(true);
    expect(item.get('checked')).toEqual(true)
  });

  it('can handle id property name', () => {
    const propertyName = 'id';
    const file = factories.imageFile({rights: 'Some artist',
                                      configuration: {rights_display: 'inline'}});
    const inputModel = new Backbone.Model();

    const item = new InlineFileRightsMenuItem({}, {inputModel, propertyName, file});
    item.selected();

    expect(inputModel.get('inlineRightsHidden')).toEqual(true);
    expect(item.get('checked')).toEqual(true)
  });
});
