import {DropDownMenuItems} from 'pageflow/editor/api/DropDownMenuItems';

describe('DropDownMenuItems', () => {
  describe('#register/#findAllByMenuName', () => {
    it(
      'allows getting a list of menu items by menu name',
      () => {
        var dropDownMenuItems = new DropDownMenuItems();

        dropDownMenuItems.register({
          name: 'custom',
          label: 'Custom Item',
          selected: () => {
          }
        }, {
          menuName: 'someMenu',
        });

        var menuItem = dropDownMenuItems.findAllByMenuName('someMenu')[0];

        expect(menuItem.name).toBe('custom');
      }
    );

    it(
      'only returns the list of menu items for the specified menu name',
      () => {
        var dropDownMenuItems = new DropDownMenuItems();

        dropDownMenuItems.register({
          name: 'custom',
          label: 'Custom Item',
          selected: () => {
          }
        }, {
          menuName: 'someOtherMenu',
        });

        var menuItems = dropDownMenuItems.findAllByMenuName('someMenu');

        expect(menuItems.length).toBe(0);
      }
    );

    it(
      'allows registering multiple menu items per menu name',
      () => {
        var dropDownMenuItems = new DropDownMenuItems();

        dropDownMenuItems.register({
          name: 'custom1',
          label: 'Custom Item 1',
          selected: () => {
          }
        }, {
          menuName: 'someMenu',
        });

        dropDownMenuItems.register({
          name: 'custom2',
          label: 'Custom Item 2',
          selected: () => {
          }
        }, {
          menuName: 'someMenu',
        });

        var menuItems = dropDownMenuItems.findAllByMenuName('someMenu');

        expect(menuItems.length).toBe(2);
      }
    );
  });
});
