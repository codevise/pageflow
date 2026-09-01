import $ from 'jquery';
import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {state} from '$state';

// Lists the places of the entry that reference a file. Entry types
// provide the places via `Entry#fileReferences`. Each place has a
// label, an optional detail naming the referencing property and a
// pictogram. Clicking an item selects the referencing model in the
// editor.
export const FileReferencesView = Marionette.ItemView.extend({
  className: 'file_references',

  template: () => `
    <div class="file_references-separator">
      <h3 class="file_references-header">
        ${I18n.t('pageflow.editor.views.file_references.header')}
      </h3>
    </div>
    <div class="file_references-list"></div>
  `,

  ui: {
    list: '.file_references-list'
  },

  onRender() {
    this.update();
  },

  // Rebuilt on every open, since the overlay outlives the entry state
  // it describes.
  update() {
    const places = state.entry.fileReferences().placesFor(this.model);

    this.ui.list.empty().append(places.map(place => renderItem(place)));
    this.$el.toggle(places.length > 0);
  }
});

function renderItem(place) {
  const item = $('<button />', {type: 'button', class: 'file_references-item'});
  const lines = $('<span />', {class: 'file_references-lines'});

  item.append($('<span />', {
    class: 'file_references-pictogram',
    style: `mask-image: url('${escapeCssUrl(place.pictogram)}')`
  }));

  lines.append($('<span />', {class: 'file_references-label', text: place.label}));

  if (place.detail) {
    lines.append($('<span />', {class: 'file_references-detail', text: place.detail}));
  }

  item.append(lines);
  item.on('click', () => place.select());

  return item[0];
}

function escapeCssUrl(url) {
  return url.replace(/'/g, "\\'").replace(/\n/g, '');
}
