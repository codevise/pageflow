import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import $ from 'jquery';

import {app} from '../app';

import {dialogView} from './mixins/dialogView';

import template from '../templates/motifAreaSelection.jst';
import {editor} from "../base";

export const MotifAreaSelectionView = Marionette.ItemView.extend({
  template,
  className: 'motif_area_selection dialog',

  mixins: [dialogView],

  ui: {
    wrapper: '.wrapper'
  },

  events: {
    'click .save': function() {
      this.save();
      this.close();
    }
  },

  initialize: function() {
    //console.log(this.options);
    //console.log('-----------_Y');
    //console.log(editor.fileTypes);
    //var fileType = editor.fileTypes.findByCollectionName(this.options.filesCollection)
    //this.fileUsage = this.options.filesCollection.model();
    this.model = this.options.model;
    console.log('this.model');
    console.log(this.model);
  },

  onRender: function() {
    var file = this.model,
        image = $('<img />').attr('src', file.getBackgroundPositioningImageUrl());

    this.ui.wrapper.append(image);

    if(file.attributes.configuration.motifArea) {
      this.motifArea = file.attributes.configuration.motifArea;
    } else {
      this.motifArea = {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      }
    }

    var displayWidth = 500.0;
    var scaleFactor = file.attributes.width / displayWidth;
    var displayHeight = file.attributes.height / scaleFactor;

    var scaledX = displayWidth * (this.motifArea.left / 100);
    var scaledY = displayHeight * (this.motifArea.top / 100);
    var scaledWidth = displayWidth * (this.motifArea.width / 100);
    var scaledHeight = displayHeight * (this.motifArea.height / 100);

    var that = this;
    setTimeout(function(){
      $('.box .wrapper img').imgAreaSelect({
        x1: scaledX,
        x2: scaledX + scaledWidth,
        y1: scaledY,
        y2: scaledY + scaledHeight,
        handles: true,
        onSelectEnd: function (img, selection) {
          that.motifArea = {
            left: Math.round((selection.x1 / displayWidth) * 100.0),
            top: Math.round((selection.y1 / displayHeight) * 100.0),
            width: Math.round(((selection.x2 - selection.x1) / displayWidth) * 100.0),
            height: Math.round(((selection.y2 - selection.y1) / displayHeight) * 100.0)
          }
        }
      });
    }, 0);
  },

  save: function() {
    console.log('save');
    console.log(this.motifArea);
    /*
    this.model.configuration = {
        motifArea: this.motifArea
      };
    */
  },

  onBeforeClose: function () {
    $('.box .wrapper img').imgAreaSelect({remove:true});
  }
});

MotifAreaSelectionView.open = function(options) {
  app.dialogRegion.show(new MotifAreaSelectionView(options));
};
