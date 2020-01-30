import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {editor, modelLifecycleTrackingView} from 'pageflow/editor';
import {cssModulesUtils, SortableCollectionView} from 'pageflow/ui';

import {SectionItemView} from './SectionItemView';

import styles from './ChapterItemView.module.css';

export const ChapterItemView = Marionette.Layout.extend({
  tagName: 'li',
  className: styles.root,

  mixins: [modelLifecycleTrackingView({classNames: styles})],

  template: () => `
     <a class="${styles.link}" href="">
       <span class="${styles.number}"></span>
       <span class="${styles.title}"></span>
       <span class="${styles.creatingIndicator}" />
       <span class="${styles.destroyingIndicator}" />
       <span class="${styles.failedIndicator}"
             title="${I18n.t('pageflow_scrolled.editor.chapter_item.save_error')}" />
     </a>

     <ul class="${styles.sections}"></ul>

     <a href="" class="${styles.addSection}">${I18n.t('pageflow_scrolled.editor.chapter_item.add_section')}</a>
  `,

  ui: cssModulesUtils.ui(styles, 'title', 'number', 'sections'),

  events: cssModulesUtils.events(styles, {
    'click addSection': function() {
      this.model.addSection();
    },

    'click link': function() {
      if (!this.model.isNew() && !this.model.isDestroying()) {
        editor.navigate('/scrolled/chapters/' + this.model.get('id'), {trigger: true});
      }
      return false;
    }
  }),

  modelEvents: {
    change: 'update'
  },

  onRender() {
    this.subview(new SortableCollectionView({
      el: this.ui.sections,
      collection: this.model.sections,
      itemViewConstructor: SectionItemView,
      itemViewOptions: {
        entry: this.options.entry
      },
      connectWith: cssModulesUtils.selector(styles, 'sections')
    }));

    this.update();
  },

  update() {
    this.ui.title.text(this.model.configuration.get('title') || I18n.t('pageflow.editor.views.chapter_item_view.unnamed'));
    this.ui.number.text(I18n.t('pageflow.editor.views.chapter_item_view.chapter') + ' ' + (this.model.get('position') + 1));
  }
});
