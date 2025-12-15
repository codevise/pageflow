import Backbone from 'backbone';

import {
  editor,
  EditConfigurationView,
  configurationContainer,
  failureTracking
} from 'pageflow/editor';

import {TextInputView} from 'pageflow/ui';
import {ConfigurationEditor} from '$support/dominos/ui';
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

  it('allows overriding destroyModel method', () => {
    const Model = Backbone.Model.extend({
      mixins: [configurationContainer(), failureTracking]
    });
    const customDestroyMethod = jest.fn();
    const View = EditConfigurationView.extend({
      configure(configurationEditor) {
        configurationEditor.tab('general', function() {
        });
      },

      destroyModel: customDestroyMethod
    });

    const view = new View({model: new Model()}).render();
    window.confirm = () => true;
    view.$el.find('.destroy').click();

    expect(customDestroyMethod).toHaveBeenCalled();
    expect(editor.router.navigate).toHaveBeenCalled();
  });

  it('does not go back if destroyModel returns false', () => {
    const Model = Backbone.Model.extend({
      mixins: [configurationContainer(), failureTracking]
    });
    const View = EditConfigurationView.extend({
      configure(configurationEditor) {
        configurationEditor.tab('general', function() {
        });
      },

      destroyModel() {
        return false;
      }
    });

    const view = new View({model: new Model()}).render();
    window.confirm = () => true;
    view.$el.find('.destroy').click();

    expect(editor.router.navigate).not.toHaveBeenCalled();
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

  describe('hideDestroyButton', () => {
    it('shows destroy button by default', () => {
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

      expect(view.$el.find('.destroy')).toHaveLength(1);
    });

    it('hides destroy button when hideDestroyButton is true', () => {
      const Model = Backbone.Model.extend({
        mixins: [configurationContainer(), failureTracking]
      });
      const View = EditConfigurationView.extend({
        hideDestroyButton: true,

        configure(configurationEditor) {
          configurationEditor.tab('general', function() {
          });
        }
      });

      const view = new View({model: new Model()}).render();

      expect(view.$el.find('.destroy')).toHaveLength(0);
    });

    it('supports hideDestroyButton as function', () => {
      const Model = Backbone.Model.extend({
        mixins: [configurationContainer(), failureTracking]
      });
      const View = EditConfigurationView.extend({
        hideDestroyButton() {
          return this.model.get('preventDestroy');
        },

        configure(configurationEditor) {
          configurationEditor.tab('general', function() {
          });
        }
      });

      const viewWithDestroy = new View({model: new Model({preventDestroy: false})}).render();
      const viewWithoutDestroy = new View({model: new Model({preventDestroy: true})}).render();

      expect(viewWithDestroy.$el.find('.destroy')).toHaveLength(1);
      expect(viewWithoutDestroy.$el.find('.destroy')).toHaveLength(0);
    });

    it('does not prevent destroy event handler when button is shown', () => {
      const Model = Backbone.Model.extend({
        mixins: [configurationContainer(), failureTracking],
        destroyWithDelay: jest.fn()
      });
      const View = EditConfigurationView.extend({
        hideDestroyButton: false,

        configure(configurationEditor) {
          configurationEditor.tab('general', function() {
          });
        }
      });

      const view = new View({model: new Model()}).render();
      window.confirm = () => true;
      view.$el.find('.destroy').click();

      expect(view.model.destroyWithDelay).toHaveBeenCalled();
    });
  });
});
