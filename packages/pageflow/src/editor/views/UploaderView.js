import Marionette from 'backbone.marionette';

import {UploadError} from '../api/errors';
import {app} from '../app';

import {state} from '$state';

export const UploaderView = Marionette.View.extend({
  el: 'form#upload',

  initialize: function() {
    this.listenTo(app, 'request-upload', this.openFileDialog);
  },

  render: function() {
    var that = this;

    this.$el.fileupload({
      type: 'POST',
      paramName: 'file',
      dataType: 'XML',
      acceptFileTypes: new RegExp('(\\.|\\/)(bmp|gif|jpe?g|png|ti?f|wmv|mp4|mpg|mov|asf|asx|avi|' +
                                  'm?v|mpeg|qt|3g2|3gp|3ivx|divx|3vx|vob|flv|dvx|xvid|mkv|vtt)$',
                                  'i'),

      add: function(event, data) {
        try {
          state.fileUploader.add(data.files[0]).then(function (record) {
            data.record = record;
            record.save(null, {
              success: function() {
                var directUploadConfig = data.record.get('direct_upload_config');
                data.url = directUploadConfig.url;
                data.formData = directUploadConfig.fields;
                var xhr = data.submit();
                that.listenTo(data.record, 'uploadCancelled', function() {
                  xhr.abort();
                });
              }
            });
          });
        }
        catch(e) {
          if (e instanceof UploadError) {
            app.trigger('error', e);
          }
          else {
            throw(e);
          }
        }
      },

      progress: function(event, data) {
        data.record.set('uploading_progress', parseInt(data.loaded / data.total * 100, 10));
      },

      done: function(event, data) {
        data.record.unset('uploading_progress');
        data.record.publish();
      },

      fail: function(event, data) {
        if (data.errorThrown !== 'abort') {
          data.record.uploadFailed();
        }
      },

      always: function(event, data) {
        that.stopListening(data.record);
      }
    });

    return this;
  },

  openFileDialog: function() {
    this.$('input:file').click();
  }
});
