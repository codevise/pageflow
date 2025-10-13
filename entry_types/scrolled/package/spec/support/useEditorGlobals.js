import {editor, FilesCollection, Site} from 'pageflow/editor';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';

import {setupGlobals} from 'pageflow/testHelpers';
import {factories, normalizeSeed} from 'support';
import I18n from 'i18n-js';

// Required to define editor.entryType global
import 'editor/config';

export function useEditorGlobals() {
  const {setGlobals} = setupGlobals();

  beforeEach(() => {
    editor.fileTypes = factories.fileTypes(
      builder => builder
        .withImageFileType()
        .withVideoFileType()
        .withAudioFileType()
        .withTextTrackFileType()
    );

    window.I18n = I18n;
  });

  return {
    createEntry(options) {
      const {
        metadata,
        imageFiles, videoFiles, audioFiles, textTrackFiles,
        site,
        ...seedOptions
      } = options;

      const {entry} = setGlobals({
        entry: factories.entry(ScrolledEntry, {metadata}, {
          site: new Site(site),
          files: FilesCollection.createForFileTypes(
            [
              editor.fileTypes.findByCollectionName('image_files'),
              editor.fileTypes.findByCollectionName('video_files'),
              editor.fileTypes.findByCollectionName('audio_files'),
              editor.fileTypes.findByCollectionName('text_track_files')
            ],
            {
              image_files: imageFiles,
              video_files: videoFiles,
              audio_files: audioFiles,
              text_track_files: textTrackFiles
            }
          ),
          entryTypeSeed: normalizeSeed(seedOptions)
        })
      });

      return entry;
    }
  };
}
