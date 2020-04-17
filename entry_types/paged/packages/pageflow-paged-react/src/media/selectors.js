import {actionCreators} from './actions';
import {nestedFiles} from 'files/selectors';
import {pageState, pageAttribute} from 'pages/selectors';
import {setting} from 'settings/selectors';
import {t, locale} from 'i18n/selectors';
import {muted as backgroundMediaMuted} from 'backgroundMedia/selectors';
import {memoizedSelector} from 'utils';

import {bindActionCreators} from 'redux';

export function playerState({scope = 'default'} = {}) {
  return pageState(`media.${scope}`);
}

export function playerActions({scope = 'default'} = {}) {
  return function (dispatch) {
    return bindActionCreators(actionCreators({scope}), dispatch);
  };
}

export function textTracks({file, defaultTextTrackFileId = () => {}}) {
  return memoizedSelector(
    setting({property: 'textTrack'}),
    setting({property: 'volume'}),
    t,
    locale,
    nestedFiles('textTrackFiles', {
      parent: file
    }),
    defaultTextTrackFileId,
    (textTrackSettings, volume, translate, currentLocale, textTrackFiles, defaultTextTrackFileId) => {
      textTrackSettings = textTrackSettings || {};
      const files = textTrackFiles.map(textTrackFile => ({
        displayLabel: displayLabel(textTrackFile, translate),
        ...textTrackFile
      }));

      const autoFile = autoTextTrackFile(files,
                                         defaultTextTrackFileId,
                                         currentLocale,
                                         volume);

      return {
        files: files.sort((file1, file2) =>
                          (file1.displayLabel || '').localeCompare(file2.displayLabel || '')
                         ),
        autoFile,
        activeFileId: getActiveTextTrackFileId(files,
                                               autoFile,
                                               textTrackSettings),
        mode: textTrackSettings.kind == 'off' ? 'off' :
          textTrackSettings.kind ? 'user' : 'auto'
      };
    }
  );
}

function autoTextTrackFile(textTrackFiles, defaultTextTrackFileId, locale, volume) {
  if (defaultTextTrackFileId) {
    const defaultTextTrackFile = textTrackFiles.find(textTrackFile =>
      textTrackFile.permaId == defaultTextTrackFileId
    );

    if (defaultTextTrackFile) {
      return defaultTextTrackFile;
    }
  }

  const subtitlesInEntryLanguage = textTrackFiles.find(textTrackFile => {
    return textTrackFile.kind == 'subtitles' &&
           textTrackFile.srclang == locale;
  });

  const captionsForMutedVideo = volume == 0 && textTrackFiles.find(textTrackFile => {
    return textTrackFile.kind == 'captions';
  });

  return subtitlesInEntryLanguage || captionsForMutedVideo;
}

function displayLabel(textTrackFile, t) {
  return textTrackFile.label ||
         t('pageflow.public.languages.' + textTrackFile.srclang || 'unknown',
           {defaultValue: t('pageflow.public.languages.unknown')});
}

function getActiveTextTrackFileId(textTrackFiles, autoTextTrackFile, options) {
  if (options.kind == 'off') {
    return null;
  }

  const file = textTrackFiles.find(textTrackFile => (
    textTrackFile.srclang == options.srclang &&
    textTrackFile.kind == options.kind
  ));

  if (file) {
    return file.id;
  }

  return autoTextTrackFile && autoTextTrackFile.id;
}

export function videoQualitySetting() {
  return setting({property: 'videoQuality'});
}

export function pageShouldAutoplay({autoplayWhenBackgroundMediaMuted, id}) {
  return memoizedSelector(
    autoplayWhenBackgroundMediaMuted,
    pageHasAutoplayOption({id: id}),
    backgroundMediaMuted,
    (autoplayWhenBackgroundMediaMuted, autoplayOption, isBackgroudMediaMuted) => {
      return autoplayOption && (!isBackgroudMediaMuted || autoplayWhenBackgroundMediaMuted);
    }
  );
}

export function pageHasAutoplayOption(options) {
  return memoizedSelector(
    pageAttribute('autoplay', options),
    (autoplayOption) => {
      return autoplayOption !== false;
    }
  );
}
