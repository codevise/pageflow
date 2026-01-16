import Marionette from 'backbone.marionette';

import styles from './ContentElementTypeSeparatorView.module.css';

export const ContentElementTypeSeparatorView = Marionette.ItemView.extend({
  className: styles.separator,

  template: (data) => `
    <span class="${styles.rule}"></span>
    <span class="${styles.typeName}">${data.typeName}</span>
    ${data.pictogram ? `<span class="${styles.pictogram}" style="mask-image: url('${escapeCssUrl(data.pictogram)}')"></span>` : ''}
    <span class="${styles.rule}"></span>
  `,

  serializeData() {
    return {
      pictogram: this.options.pictogram,
      typeName: this.options.typeName
    };
  }
});

function escapeCssUrl(url) {
  return url.replace(/'/g, "\\'").replace(/\n/g, '');
}
