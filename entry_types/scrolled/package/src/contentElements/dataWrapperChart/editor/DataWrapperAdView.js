import Marionette from 'backbone.marionette';
import I18n from 'i18n-js';

export const DatawrapperAdView = Marionette.ItemView.extend({
  template: (data) => `
    <form action="https://datawrapper.de/chart/create" method="POST" target="_blank">
      <input type="hidden" name="theme" value="pageflow" />
      <input type="submit" value="${I18n.t('pageflow_scrolled.editor.content_elements.dataWrapperChart.attributes.create_chart.label')}" />
    </form>
  `,
  className: 'datawrapper_ad'
});
