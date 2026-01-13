import Backbone from 'backbone';

import {
  editor,
  EditConfigurationView,
  configurationContainer,
  failureTracking
} from 'pageflow/editor';

import {TextInputView} from 'pageflow/ui';
import {ConfigurationEditor} from '$support/dominos/ui';
import {DropDownButton} from '$support/dominos/editor';
import * as support from '$support';

describe('EditConfigurationView', () => {
  beforeEach(() => {
    editor.router = {navigate: jest.fn()};
  });

  it('renders configuration editor with inputs defined in configure method', () => {
    const Model = Backbone.Model.extend({
      mixins: [configurationContainer(), failureTracking]
    });
    const View = EditConfigurationView.extend({
      configure(configurationEditor) {
        configurationEditor.tab('general', function() {
          this.input('title', TextInputView);
        });
      }
    });

    const view = new View({model: new Model()}).render();
    const configurationEditor = ConfigurationEditor.find(view);

    expect(configurationEditor.inputPropertyNames()).toContain('title');
  });

  describe('translationKeyPrefix', () => {
    support.useFakeTranslations({
      edit_something: {
        tabs: {
          general: 'Something'
        }
      },
      edit_section: {
        tabs: {
          general: 'Section'
        }
      },
      pageflow: {
        editor: {
          views: {
            edit_configuration: {
              back: 'Back',
              outline: 'Outline'
            }
          }
        }
      }
    });

    it('is used for tab labels', () => {
      const Model = Backbone.Model.extend({
        mixins: [configurationContainer(), failureTracking]
      });
      const View = EditConfigurationView.extend({
        translationKeyPrefix: 'edit_something',

        configure(configurationEditor) {
          configurationEditor.tab('general', function() {
            this.input('title', TextInputView);
          });
        }
      });

      const view = new View({model: new Model()}).render();
      const configurationEditor = ConfigurationEditor.find(view);

      expect(configurationEditor.tabLabels()).toContain('Something');
    });

    it('can be function', () => {
      const Model = Backbone.Model.extend({
        mixins: [configurationContainer(), failureTracking]
      });
      const View = EditConfigurationView.extend({
        translationKeyPrefix() {
          return `edit_${this.model.get('typeName')}`;
        },

        configure(configurationEditor) {
          configurationEditor.tab('general', function() {
            this.input('title', TextInputView);
          });
        }
      });

      const view = new View({model: new Model({typeName: 'section'})}).render();
      const configurationEditor = ConfigurationEditor.find(view);

      expect(configurationEditor.tabLabels()).toContain('Section');
    });
  });

  describe('goBack navigation', () => {
    it('navigates to / by default', () => {
      const Model = Backbone.Model.extend({
        mixins: [configurationContainer(), failureTracking]
      });
      const View = EditConfigurationView.extend({
        configure(configurationEditor) {
          configurationEditor.tab('general', function() {
          });
        }
      });

      const view = new View({model: new Model()}).render();
      view.goBack();

      expect(editor.router.navigate).toHaveBeenCalledWith('/', {trigger: true});
    });

    it('uses custom goBackPath when provided', () => {
      const Model = Backbone.Model.extend({
        mixins: [configurationContainer(), failureTracking]
      });
      const View = EditConfigurationView.extend({
        goBackPath: '/custom/path',

        configure(configurationEditor) {
          configurationEditor.tab('general', function() {
          });
        }
      });

      const view = new View({model: new Model()}).render();
      view.goBack();

      expect(editor.router.navigate).toHaveBeenCalledWith('/custom/path', {trigger: true});
    });

    it('supports goBackPath as function', () => {
      const Model = Backbone.Model.extend({
        mixins: [configurationContainer(), failureTracking]
      });
      const View = EditConfigurationView.extend({
        goBackPath() {
          return `/dynamic/${this.model.get('id')}`;
        },

        configure(configurationEditor) {
          configurationEditor.tab('general', function() {
          });
        }
      });

      const view = new View({model: new Model({id: 123})}).render();
      view.goBack();

      expect(editor.router.navigate).toHaveBeenCalledWith('/dynamic/123', {trigger: true});
    });
  });

  describe('back button translation', () => {
    support.useFakeTranslations({
      pageflow: {
        editor: {
          views: {
            edit_configuration: {
              back: 'Back',
              outline: 'Outline'
            }
          }
        }
      }
    });

    it('uses "outline" translation by default', () => {
      const Model = Backbone.Model.extend({
        mixins: [configurationContainer(), failureTracking]
      });
      const View = EditConfigurationView.extend({
        configure(configurationEditor) {
          configurationEditor.tab('general', function() {
          });
        }
      });

      const view = new View({model: new Model()}).render();

      expect(view.$el.find('.back').text()).toBe('Outline');
    });

    it('uses "back" translation when custom goBackPath is provided', () => {
      const Model = Backbone.Model.extend({
        mixins: [configurationContainer(), failureTracking]
      });
      const View = EditConfigurationView.extend({
        goBackPath: '/custom/path',

        configure(configurationEditor) {
          configurationEditor.tab('general', function() {
          });
        }
      });

      const view = new View({model: new Model()}).render();

      expect(view.$el.find('.back').text()).toBe('Back');
    });

    it('uses "back" translation when goBackPath is a function', () => {
      const Model = Backbone.Model.extend({
        mixins: [configurationContainer(), failureTracking]
      });
      const View = EditConfigurationView.extend({
        goBackPath() {
          return '/dynamic/path';
        },

        configure(configurationEditor) {
          configurationEditor.tab('general', function() {
          });
        }
      });

      const view = new View({model: new Model()}).render();

      expect(view.$el.find('.back').text()).toBe('Back');
    });
  });

  describe('defaultTab', () => {
    support.useFakeTranslations({
      test_default_tab: {
        tabs: {
          main: 'Main',
          other: 'Other'
        }
      }
    });

    it('supports defaultTab method to set initial tab', () => {
      const Model = Backbone.Model.extend({
        mixins: [configurationContainer(), failureTracking]
      });
      const View = EditConfigurationView.extend({
        translationKeyPrefix: 'test_default_tab',

        defaultTab() {
          return 'other';
        },

        configure(configurationEditor) {
          configurationEditor.tab('main', function() {});
          configurationEditor.tab('other', function() {});
        }
      });

      const view = new View({model: new Model()}).render();

      expect(view.$el.find('[aria-selected="true"]').text()).toBe('Other');
    });
  });

  describe('actions dropdown', () => {
    support.useFakeTranslations({
      pageflow: {
        editor: {
          views: {
            edit_configuration: {
              actions: 'Actions',
              confirm_destroy: 'Really delete?',
              destroy: 'Delete'
            }
          }
        }
      }
    });

    it('does not render dropdown by default', () => {
      const Model = Backbone.Model.extend({
        mixins: [configurationContainer(), failureTracking]
      });
      const View = EditConfigurationView.extend({
        configure(configurationEditor) {
          configurationEditor.tab('general', function() {
          });
        }
      });

      const view = new View({model: new Model()}).render();

      expect(DropDownButton.findAll(view)).toHaveLength(0);
    });

    it('renders dropdown when getActionsMenuItems returns items', () => {
      const Model = Backbone.Model.extend({
        mixins: [configurationContainer(), failureTracking]
      });
      const CustomMenuItem = Backbone.Model.extend({
        selected: jest.fn()
      });
      const View = EditConfigurationView.extend({
        getActionsMenuItems() {
          return [new CustomMenuItem({name: 'custom', label: 'Custom Action'})];
        },
        configure(configurationEditor) {
          configurationEditor.tab('general', function() {});
        }
      });

      const view = new View({model: new Model()}).render();
      const dropDownButton = DropDownButton.find(view);

      expect(dropDownButton.menuItemLabels()).toContain('Custom Action');
    });

    it('uses Actions as button label', () => {
      const Model = Backbone.Model.extend({
        mixins: [configurationContainer(), failureTracking]
      });
      const CustomMenuItem = Backbone.Model.extend({
        selected: jest.fn()
      });
      const View = EditConfigurationView.extend({
        getActionsMenuItems() {
          return [new CustomMenuItem({name: 'custom', label: 'Custom'})];
        },
        configure(configurationEditor) {
          configurationEditor.tab('general', function() {
          });
        }
      });

      const view = new View({model: new Model()}).render();

      expect(view.$el.find('.drop_down_button button').text()).toBe('Actions');
    });
  });

  describe('model destroy', () => {
    it('navigates back when model is destroyed', () => {
      const Model = Backbone.Model.extend({
        mixins: [configurationContainer(), failureTracking]
      });
      const View = EditConfigurationView.extend({
        configure(configurationEditor) {
          configurationEditor.tab('general', function() {});
        }
      });
      const model = new Model();

      new View({model}).render();
      model.trigger('destroy');

      expect(editor.router.navigate).toHaveBeenCalledWith('/', {trigger: true});
    });
  });
});
