import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import classNames from 'classnames';

import {cssModulesUtils, CollectionView} from 'pageflow/ui';

import {SelectableSectionItemView} from './SelectableSectionItemView';

import baseStyles from './ChapterItemView.module.css';
import styles from './SelectableChapterItemView.module.css';

export const SelectableChapterItemView = Marionette.ItemView.extend({
  tagName: 'li',

  className() {
    return classNames(baseStyles.root, styles.root, {
      [styles.empty]: this.model.sections.length === 0
    });
  },

  template: (data) => `
    ${data.selectable ? `
      <a class="${baseStyles.link}"
         href=""
         title="${I18n.t(`pageflow_scrolled.editor.selectable_chapter_item.title`)}">
        <span class="${baseStyles.number}"></span>
        <span class="${baseStyles.title}"></span>
      </a>
    ` : `
      <span class="${baseStyles.header}">
        <span class="${baseStyles.number}"></span>
        <span class="${baseStyles.title}"></span>
      </span>
    `}
    <ul class="${baseStyles.sections}"></ul>
    ${data.mode === 'insertPosition' ? `
      <a class="${styles.emptyChapterInsertMask}" href="">
        <span class="${styles.indicatorTooltip}">
          ${I18n.t('pageflow_scrolled.editor.selectable_chapter_item.insert_here')}
        </span>
      </a>
    ` : ''}
    `,

  ui: cssModulesUtils.ui(baseStyles, 'title', 'number', 'sections'),

  serializeData() {
    return {
      mode: this.options.mode,
      selectable: this.options.mode !== 'insertPosition' &&
                  this.options.mode !== 'sectionPart'
    };
  },

  events() {
    return {
      ...cssModulesUtils.events(baseStyles, {
        'click link': function(event) {
          event.preventDefault();
          this.options.onSelectChapter(this.model);
        },

        'mouseenter link': function() {
          this.$el.addClass(baseStyles.selectableHover);
        },

        'mouseleave link': function() {
          this.$el.removeClass(baseStyles.selectableHover);
        }
      }),
      ...cssModulesUtils.events(styles, {
        'click emptyChapterInsertMask': function(event) {
          event.preventDefault();
          this.options.onSelectInsertPosition({
            chapter: this.model,
            position: 'into'
          });
        }
      })
    };
  },

  modelEvents: {
    change: 'update'
  },

  initialize() {
    if (this.options.selection) {
      this.listenTo(this.options.selection, 'change', this.updateSelected);
    }
  },

  onRender() {
    this.subview(new CollectionView({
      el: this.ui.sections,
      collection: this.model.sections,
      itemViewConstructor: SelectableSectionItemView,
      itemViewOptions: {
        entry: this.options.entry,
        mode: this.options.mode,
        selection: this.options.selection,
        onSelect: this.options.onSelectSection,
        onSelectInsertPosition: this.options.onSelectInsertPosition,
        onSelectSectionPart: this.options.onSelectSectionPart
      }
    }));

    this.update();

    if (this.updateSelected()) {
      setTimeout(() => this.el.scrollIntoView({block: 'start'}), 10);
    }
  },

  updateSelected() {
    const selected = !!this.options.selection &&
                     this.options.selection.get('chapter') === this.model.get('permaId');

    this.$el.toggleClass(styles.selected, selected);
    this.$el.attr('aria-current', selected ? 'true' : null);

    return selected;
  },

  update() {
    this.ui.title.text(this.model.getDisplayTitle());
    this.ui.number.text(this.model.getDisplayNumber());
  }
});
