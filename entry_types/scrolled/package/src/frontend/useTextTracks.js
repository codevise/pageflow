import {useEntryMetadata, useNestedFiles} from '../entryState';
import {useSetting} from './useSetting';
import {useI18n} from './i18n';

export function useTextTracks({file, defaultTextTrackFilePermaId, captionsByDefault}) {
  let [setting, setSetting] = useSetting('textTrack');
  setting = setting || {};

  const {t} = useI18n();
  const {locale} = useEntryMetadata();
  const textTrackFiles = useTextTrackFiles({file})

  const autoTextTrackFile = getAutoTextTrackFile(textTrackFiles,
                                                 defaultTextTrackFilePermaId,
                                                 locale,
                                                 captionsByDefault);
  return {
    mode: setting.kind === 'off' ? 'off' : setting.kind ? 'user' : 'auto',
    autoDisplayLabel: autoTextTrackFile ?
                      t('pageflow_scrolled.public.text_track_modes.auto', {
                        label: autoTextTrackFile.displayLabel
                      }) :
                      t('pageflow_scrolled.public.text_track_modes.auto_off'),
    files: textTrackFiles,
    activeFileId: getActiveTextTrackFileId(textTrackFiles,
                                           autoTextTrackFile,
                                           setting),

    select(textTrackFileIdOrKind) {
      if (textTrackFileIdOrKind === 'off') {
        setSetting({kind: 'off'});
      }
      else if (textTrackFileIdOrKind === 'auto') {
        setSetting({});
      }
      else {
        const textTrackFile = textTrackFiles.find(file => file.id === textTrackFileIdOrKind);

        setSetting({
          kind: textTrackFile.configuration.kind,
          srclang: textTrackFile.configuration.srclang
        });
      }
    }
  };
}

function useTextTrackFiles({file}) {
  const {t} = useI18n();

  return useNestedFiles({collectionName: 'textTrackFiles', parent: file})
    .map(file => addDisplayLabel(file, t))
    .sort((file1, file2) =>
      (file1.displayLabel).localeCompare(file2.displayLabel)
    );
}

function getActiveTextTrackFileId(textTrackFiles, autoTextTrackFile, setting) {
  if (setting.kind === 'off') {
    return null;
  }

  const file = textTrackFiles.find(textTrackFile => (
    textTrackFile.configuration.srclang === setting.srclang &&
    textTrackFile.configuration.kind === setting.kind
  ));

  if (file) {
    return file.id;
  }

  return autoTextTrackFile && autoTextTrackFile.id;
}

function getAutoTextTrackFile(textTrackFiles, defaultTextTrackFilePermaId, locale, captionsByDefault) {
  if (defaultTextTrackFilePermaId) {
    const defaultTextTrackFile = textTrackFiles.find(textTrackFile =>
      textTrackFile.permaId === defaultTextTrackFilePermaId
    );

    if (defaultTextTrackFile) {
      return defaultTextTrackFile;
    }
  }

  const subtitlesInEntryLanguage = textTrackFiles.find(textTrackFile => {
    return textTrackFile.configuration.kind === 'subtitles' &&
           textTrackFile.configuration.srclang === locale;
  });

  const defaultCaptions = captionsByDefault ? textTrackFiles.find(textTrackFile => {
    return textTrackFile.configuration.kind === 'captions';
  }) : null;

  return subtitlesInEntryLanguage || defaultCaptions;
}

function addDisplayLabel(textTrackFile, t) {
  return {
    ...textTrackFile,
    displayLabel: textTrackFile.configuration.label ||
                  t('pageflow_scrolled.public.languages.' +
                    textTrackFile.configuration.srclang || 'unknown',
                    {defaultValue: t('pageflow_scrolled.public.languages.unknown')})
  };
}
