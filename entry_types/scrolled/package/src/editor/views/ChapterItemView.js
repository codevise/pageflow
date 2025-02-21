import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {editor, modelLifecycleTrackingView} from 'pageflow/editor';
import {cssModulesUtils, SortableCollectionView} from 'pageflow/ui';
import {browser} from 'pageflow/frontend';

import {SectionItemView} from './SectionItemView';

import styles from './ChapterItemView.module.css';

export const ChapterItemView = Marionette.Layout.extend({
  tagName: 'li',
  className: `${styles.root}`,

  mixins: [modelLifecycleTrackingView({classNames: styles})],

  template: () => `
     <a class="${styles.outlineLink}" href="">
       <span class="${styles.dragHandle}"
             title="${I18n.t('pageflow_scrolled.editor.chapter_item.drag_hint')}"></span>
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
      this.model.addSection({});
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
      connectWith: cssModulesUtils.selector(styles, 'sections'),
      forceDraggableFallback: browser.agent.matchesDesktopSafari()
    }));

    this.update();
  },

  update() {
    this.ui.title.text(
      this.model.configuration.get('title') || I18n.t('pageflow_scrolled.editor.chapter_item.unnamed')
    );
    this.ui.title.toggleClass(styles.blank, !this.model.configuration.get('title'));

    this.ui.number.text(
      I18n.t('pageflow_scrolled.editor.chapter_item.chapter') + ' ' + (this.model.get('position') + 1)
    );

    if (this.model.configuration.get('hideInNavigation')) {
      this.ui.title.attr('title', I18n.t('pageflow_scrolled.editor.chapter_item.hidden_in_navigation'));
      this.ui.title.addClass(styles.hiddenInNavigation);
    }
  }
});
