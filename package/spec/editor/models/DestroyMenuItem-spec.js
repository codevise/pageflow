import {DestroyMenuItem} from 'pageflow/editor';
import {useFakeTranslations} from 'pageflow/testHelpers';

describe('DestroyMenuItem', () => {
  useFakeTranslations({
    'pageflow.editor.destroy_menu_item.destroy': 'Delete',
    'pageflow.editor.destroy_menu_item.confirm_destroy': 'Really delete?'
  });

  it('has name destroy by default', () => {
    const menuItem = new DestroyMenuItem();

    expect(menuItem.get('name')).toBe('destroy');
  });

  it('has destructive true by default', () => {
    const menuItem = new DestroyMenuItem();

    expect(menuItem.get('destructive')).toBe(true);
  });

  it('calls destroyWithDelay on model when confirmed', () => {
    const destroyedModel = {destroyWithDelay: jest.fn()};
    const menuItem = new DestroyMenuItem({}, {destroyedModel});
    window.confirm = jest.fn().mockReturnValue(true);

    menuItem.selected();

    expect(window.confirm).toHaveBeenCalledWith('Really delete?');
    expect(destroyedModel.destroyWithDelay).toHaveBeenCalled();
  });

  it('does not call destroyWithDelay if cancelled', () => {
    const destroyedModel = {destroyWithDelay: jest.fn()};
    const menuItem = new DestroyMenuItem({}, {destroyedModel});
    window.confirm = jest.fn().mockReturnValue(false);

    menuItem.selected();

    expect(destroyedModel.destroyWithDelay).not.toHaveBeenCalled();
  });

  it('uses translationKeyPrefix for label', () => {
    const menuItem = new DestroyMenuItem();

    expect(menuItem.get('label')).toBe('Delete');
  });

  it('uses translationKeyPrefix for confirmMessage', () => {
    const menuItem = new DestroyMenuItem();

    expect(menuItem.get('confirmMessage')).toBe('Really delete?');
  });
});
