import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {editor, modelLifecycleTrackingView} from 'pageflow/editor';
import {cssModulesUtils, SortableCollectionView} from 'pageflow/ui';
import {browser, features} from 'pageflow/frontend';

import {FragmentLibraryDialogView} from './FragmentLibraryDialogView';
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

     <div class="${styles.addButtons}">
       <a href="" class="${styles.addSection}">${I18n.t('pageflow_scrolled.editor.chapter_item.add_section')}</a>
       ${features.isEnabled('fragments') ? insertFragmentButton() : ''}
     </div>
  `,

  ui: cssModulesUtils.ui(styles, 'title', 'number', 'sections'),

  events: cssModulesUtils.events(styles, {
    'click addSection': function() {
      this.model.addSection({});
    },

    'click insertFragment': function() {
      FragmentLibraryDialogView.show({
        entry: this.options.entry,
        chapter: this.model
      });
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
    this.ui.title.toggleClass(styles.blank,
                              !this.model.configuration.get('title') &&
                              !!this.model.getDisplayNumber());

    this.ui.title.text(this.model.getDisplayTitle());
    this.ui.number.text(this.model.getDisplayNumber());

    if (this.model.configuration.get('hideInNavigation')) {
      this.ui.title.attr('title', I18n.t('pageflow_scrolled.editor.chapter_item.hidden_in_navigation'));
      this.ui.title.addClass(styles.hiddenInNavigation);
    }
  }
});

function insertFragmentButton() {
  return `
    <button type="button"
            class="${styles.insertFragment}"
            title="${I18n.t('pageflow_scrolled.editor.chapter_item.insert_fragment')}"
            aria-label="${I18n.t('pageflow_scrolled.editor.chapter_item.insert_fragment')}">
      <svg class="${styles.insertFragmentIcon}"
           xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"
           fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 3v17a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1H3" />
        <path d="M16 19h6" />
        <path d="M19 22v-6" />
      </svg>
    </button>
  `;
}
