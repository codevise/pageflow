import {Base} from '../Base';
import {ConfigurationEditorTab} from './ConfigurationEditorTab';
import {Tabs} from './Tabs';

export const ConfigurationEditor = Base.extend({
  selector: '.configuration_editor',

  tabNames: function() {
    return Tabs.find(this.$el).tabNames();
  },

  tabLabels: function() {
    return Tabs.find(this.$el).tabLabels();
  },

  inputPropertyNames: function() {
    return ConfigurationEditorTab.find(this.$el).inputPropertyNames();
  },

  inputLabels: function() {
    return ConfigurationEditorTab.find(this.$el).inputLabels();
  },

  inlineHelpTexts: function() {
    return ConfigurationEditorTab.find(this.$el).inlineHelpTexts();
  }
});
