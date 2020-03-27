import Backbone from 'backbone';
import I18n from 'i18n-js';

export const Theme = Backbone.Model.extend({
  title: function() {
    return I18n.t('pageflow.' + this.get('name') + '_theme.name');
  },

  thumbnailUrl: function() {
    return this.get('preview_thumbnail_url');
  },

  hasHomeButton: function() {
    return this.get('home_button');
  },

  hasOverviewButton: function() {
    return this.get('overview_button');
  },

  supportsEmphasizedPages: function() {
    return this.get('emphasized_pages');
  },

  supportsScrollIndicatorModes: function() {
    return this.get('scroll_indicator_modes');
  },

  supportsHideLogoOnPages: function() {
    return this.get('hide_logo_option');
  }
});
