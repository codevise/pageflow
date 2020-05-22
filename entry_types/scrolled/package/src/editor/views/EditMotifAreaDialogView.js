import I18n from 'i18n-js';
import $ from 'jquery';
import Marionette from 'backbone.marionette';
import '../vendor/jquery.imgareaselect';

import {app, cssModulesUtils} from 'pageflow/editor';

import styles from './EditMotifAreaDialogView.module.css';
import {dialogView} from './mixins/dialogView';
import dialogViewStyles from './mixins/dialogView.module.css';

export const EditMotifAreaDialogView = Marionette.ItemView.extend({
  template: () => `
    <div class="${dialogViewStyles.backdrop}">
      <div class="editor ${dialogViewStyles.box} ${styles.box}">
        <h1 class="${dialogViewStyles.header}">
          ${I18n.t('pageflow_scrolled.editor.edit_motif_area.header')}
        </h1>
        <p class="${dialogViewStyles.hint}">
          ${I18n.t('pageflow_scrolled.editor.edit_motif_area.hint')}
        </p>

        <div class="${styles.wrapper}">
          <div class="${styles.thumbnail}">
            <img class="${styles.image}" />
            <div class="${styles.blankSlate}">
              ${I18n.t('pageflow_scrolled.editor.edit_motif_area.blank_slate')}
            </div>
            <button class="${styles.reset}">
              ${I18n.t('pageflow_scrolled.editor.edit_motif_area.reset')}
            </button>
          </div>
        </div>

        <div class="${dialogViewStyles.footer}">
          <button class="${styles.save}">
            ${I18n.t('pageflow_scrolled.editor.edit_motif_area.save')}
          </button>
          <button class="${dialogViewStyles.close}">
            ${I18n.t('pageflow_scrolled.editor.edit_motif_area.cancel')}
          </button>
        </div>
      </div>
    </div>
  `,

  mixins: [dialogView],

  ui: cssModulesUtils.ui(styles, 'image', 'thumbnail'),

  events: cssModulesUtils.events(styles, {
    'click reset': function() {
      this.motifArea = null;
      this.updateAreaSelect();
      this.updateBlankSlate();
    },

    'click save': function() {
      this.save();
      this.close();
    }
  }),

  save() {
    this.options.file.configuration.set(
      'motifArea',
      this.getMotifAreaWithRoundedValues()
    );
  },

  onRender() {
    this.ui.image.attr('src', this.options.file.getBackgroundPositioningImageUrl());
  },

  onShow() {
    this.motifArea = this.options.file.configuration.get('motifArea');

    this.updateAreaSelect();
    this.updateBlankSlate();

    this.resizeListener = () => this.updateAreaSelect()
    $(window).on('resize', this.resizeListener);
  },

  getMotifAreaWithRoundedValues() {
    return this.motifArea && {
      left: Math.round(this.motifArea.left),
      top: Math.round(this.motifArea.top),
      width: Math.round(this.motifArea.width),
      height: Math.round(this.motifArea.height),
    }
  },

  updateAreaSelect() {
    var imageWidth = this.options.file.get('width');
    var imageHeight = this.options.file.get('height');

    this.ui.image.imgAreaSelect({
      parent: this.ui.thumbnail,
      handles: true,
      imageWidth,
      imageHeight,

      ...this.getSelection(imageWidth, imageHeight),

      onSelectStart: () => {
        this.$el.addClass(styles.dragging);
      },

      onSelectEnd: (img, selection) => {
        this.$el.removeClass(styles.dragging);

        const motifArea = {
          left: ((selection.x1 / imageWidth) * 100.0),
          top: ((selection.y1 / imageHeight) * 100.0),
          width: (((selection.x2 - selection.x1) / imageWidth) * 100.0),
          height: (((selection.y2 - selection.y1) / imageHeight) * 100.0)
        }

        if (motifArea.width > 0 && motifArea.height > 0) {
          this.motifArea = motifArea;
        }
        else {
          this.ui.image.imgAreaSelect({
            ...this.getSelection(imageWidth, imageHeight)
          });
        }

        this.updateBlankSlate();
      }
    });
  },

  getSelection(imageWidth, imageHeight) {
    if (!this.motifArea) {
      return {hide: true};
    }

    const x1 = imageWidth * (this.motifArea.left / 100);
    const y1 = imageHeight * (this.motifArea.top / 100);
    const width = imageWidth * (this.motifArea.width / 100);
    const height = imageHeight * (this.motifArea.height / 100);

    return {
      x1,
      x2: x1 + width,
      y1,
      y2: y1 + height
    };
  },

  updateBlankSlate() {
    this.$el.toggleClass(styles.blank, !this.motifArea);
  },

  onBeforeClose() {
    $(window).off('resize', this.resizeListener);
    this.ui.image.imgAreaSelect({remove: true});
  }
});

EditMotifAreaDialogView.show = function(options) {
  app.dialogRegion.show(new EditMotifAreaDialogView(options));
};
