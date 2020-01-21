import Cocktail from 'cocktail';
import I18n from 'i18n-js';
import _ from 'underscore';

import {Object} from 'pageflow/ui';

export const UploadError = Object.extend({
  setMessage: function(options) {
    this.upload = options.upload;

    var typeTranslation;
    if (options.typeTranslation) {
      typeTranslation = options.typeTranslation;
    } else if (this.upload.type !== ''){
      typeTranslation = this.upload.type;
    } else {
      typeTranslation = I18n.t('pageflow.editor.errors.upload.type_empty');
    }

    var interpolations = {name: this.upload.name,
                          type: typeTranslation,
                          validList: options.validList};

    this.message = I18n.t(options.translationKey, interpolations);
  }
});

export const UnmatchedUploadError = UploadError.extend({
  name: 'UnmatchedUploadError',

  initialize: function(upload) {
    this.setMessage({upload: upload,
                     translationKey: 'pageflow.editor.errors.unmatched_upload_error'});
  }
});

export const validFileTypeTranslationList = {
  validFileTypeTranslations: function(validFileTypes) {
    return _.map(validFileTypes,
            function(validFileType) {
              return I18n.t('activerecord.models.' + validFileType.i18nKey + '.other');
            }).join(', ');
  }
};

export const NestedTypeError = UploadError.extend({
  name: 'NestedTypeError',

  initialize: function(upload, options) {
    var fileType = options.fileType;
    var fileTypes = options.fileTypes;
    var validParentFileTypes = fileTypes.filter(function(parentFileType) {
      return parentFileType.nestedFileTypes.contains(fileType);
    });
    var validParentFileTypeTranslations = this.validFileTypeTranslations(validParentFileTypes);

    var typeI18nKey = fileTypes.findByUpload(upload).i18nKey;
    var typePluralTranslation = I18n.t('activerecord.models.' + typeI18nKey + '.other');

    this.setMessage({upload: upload,
                     translationKey: 'pageflow.editor.errors.nested_type_error',
                     typeTranslation: typePluralTranslation,
                     validList: validParentFileTypeTranslations});
  }
});
Cocktail.mixin(NestedTypeError, validFileTypeTranslationList);

export const InvalidNestedTypeError = UploadError.extend({
  name: 'InvalidNestedTypeError',

  initialize: function(upload, options) {
    var editor = options.editor;
    var fileType = options.fileType;
    var validFileTypes = editor.nextUploadTargetFile.fileType().nestedFileTypes.fileTypes;
    var validFileTypeTranslations = this.validFileTypeTranslations(validFileTypes);

    var typeI18nKey = fileType.i18nKey;
    var typeSingularTranslation = I18n.t('activerecord.models.' + typeI18nKey + '.one');

    this.setMessage({upload: upload,
                     translationKey: 'pageflow.editor.errors.invalid_nested_type_error',
                     typeTranslation: typeSingularTranslation,
                     validList: validFileTypeTranslations});
  }
});
Cocktail.mixin(InvalidNestedTypeError, validFileTypeTranslationList);
