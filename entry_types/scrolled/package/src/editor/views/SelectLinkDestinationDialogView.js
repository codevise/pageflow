import I18n from 'i18n-js';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

import {app, editor, DropDownButtonView} from 'pageflow/editor';
import {cssModulesUtils, CheckBoxInputView, TextInputView} from 'pageflow/ui';
import {utils} from 'pageflow-scrolled/frontend';

import {SelectableEntryOutlineView} from './SelectableEntryOutlineView';
import {dialogView} from './mixins/dialogView';
import dialogViewStyles from './mixins/dialogView.module.css';
import styles from './SelectLinkDestinationDialogView.module.css';

export const SelectLinkDestinationDialogView = Marionette.ItemView.extend({
  template: () => `
    <div class="${dialogViewStyles.backdrop}">
      <div class="editor ${dialogViewStyles.box} ${styles.box}">
        <h1 class="${dialogViewStyles.header}">${I18n.t('pageflow_scrolled.editor.select_link_destination.header')}</h1>

        <form class="${styles.urlContainer} configuration_editor_tab">
          <div><button class="${styles.createButton}">
            ${I18n.t('pageflow_scrolled.editor.select_link_destination.create')}
          </button></div>
        </form>

        <div class="${styles.or}">
          ${I18n.t('pageflow_scrolled.editor.select_link_destination.or')}
        </div>

        <div class="${styles.fileContainer}">
          <div>
            <label><span class="name">
              ${I18n.t('pageflow_scrolled.editor.select_link_destination.select_file')}
            </span></label>
            <div>
              ${I18n.t('pageflow_scrolled.editor.select_link_destination.select_file_description')}
            </div>
          </div>
          <div class="${styles.fileTypeButtonContainer}">
          </div>
        </div>

        <div class="${styles.or}">
          ${I18n.t('pageflow_scrolled.editor.select_link_destination.or')}
        </div>

        <label><span class="name">
          ${I18n.t('pageflow_scrolled.editor.select_link_destination.select_chapter_or_section')}
        </span></label>
        <div class="${styles.outlineContainer}"></div>

        <div class="${dialogViewStyles.footer}">
          <button type="submit" class="${dialogViewStyles.close} ${styles.close}">
            ${I18n.t('pageflow_scrolled.editor.select_link_destination.cancel')}
          </button>
        </div>
      </div>
    </div>
  `,

  ui: cssModulesUtils.ui(styles, 'urlContainer', 'outlineContainer', 'fileTypeButtonContainer'),

  mixins: [dialogView],

  events: cssModulesUtils.events(styles, {
    'submit urlContainer': function(event) {
      event.preventDefault();
      this.createExternalLink();
    }
  }),

  createExternalLink() {
    if (!this.externalLink.get('url')) {
      this.$el.find('input[type=text]').focus();
      return;
    }

    const link = {href: this.externalLink.get('url')};

    if (this.externalLink.get('openInNewTab')) {
      link.openInNewTab = true;
    }

    this.options.onSelect(link);
    this.close();
  },

  onRender() {
    this.externalLink = new Backbone.Model();
    this.externalLink.modelName = 'externalLink';

    this.ui.urlContainer.prepend(
      this.subview(new CheckBoxInputView({
        model: this.externalLink,
        propertyName: 'openInNewTab',
        label: I18n.t('pageflow_scrolled.editor.select_link_destination.open_in_new_tab')
      })).el
    );

    this.ui.urlContainer.prepend(
      this.subview(new TextInputView({
        model: this.externalLink,
        propertyName: 'url',
        label: I18n.t('pageflow_scrolled.editor.select_link_destination.enter_url'),
        maxLength: 2000
      })).el
    );

    this.ui.fileTypeButtonContainer.append(
      this.subview(new DropDownButtonView({
        label: I18n.t('pageflow_scrolled.editor.select_link_destination.select_in_sidebar'),
        buttonClassName: styles.fileTypeButton,
        alignMenu: 'right',
        items: new FileTypeItemCollection(
          this
            .options.fileTypes
            .filter(fileType => fileType.topLevelType)
            .map(fileType => ({
              label: I18n.t(`pageflow.editor.file_types.${fileType.collectionName}.name.one`),
              collectionName: fileType.collectionName
            })),
          {
          onSelect: (collectionName) => {
            currentFileSelectionCallback = (file) => {
              this.options.onSelect({
                href: {
                  file: {
                    permaId: file.get('perma_id'),
                    collectionName: utils.camelize(file.fileType().collectionName)
                  }
                }
              })
            };

            editor.selectFile({defaultTab: collectionName}, 'linkDestination', {});
            this.close();
          }
        })
      })).el
    );

    this.ui.outlineContainer.append(
      this.subview(new SelectableEntryOutlineView({
        entry: this.options.entry,

        onSelectChapter: chapter => {
          this.options.onSelect({href: {chapter: chapter.get(`permaId`)}});
          this.close();
        },
        onSelectSection: section => {
          this.options.onSelect({href: {section: section.get(`permaId`)}});
          this.close();
        }
      })).el
    );
  }
});

SelectLinkDestinationDialogView.show = function(options) {
  const view = new SelectLinkDestinationDialogView({
    fileTypes: editor.fileTypes,
    ...options
  });
  app.dialogRegion.show(view.render());
};

let currentFileSelectionCallback;

const FileSelectionHandler = function(options) {
  this.call = function(file) {
    currentFileSelectionCallback(file)
  };

  this.getReferer = function() {
    return '/';
  };
};

editor.registerFileSelectionHandler(
  'linkDestination',
  FileSelectionHandler
);

const FileTypeItemModel = Backbone.Model.extend({
  initialize(attributes, options) {
    this.onSelect = options.onSelect;
  },

  selected() {
    this.onSelect(this.get('collectionName'));
  }
});

const FileTypeItemCollection = Backbone.Collection.extend({
  model: FileTypeItemModel
});
