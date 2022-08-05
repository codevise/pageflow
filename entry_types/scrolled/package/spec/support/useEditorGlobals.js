import {editor, FilesCollection} from 'pageflow/editor';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';

import {setupGlobals} from 'pageflow/testHelpers';
import {factories, normalizeSeed} from 'support';

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
  });

  return {
    createEntry(options) {
      const {
        imageFiles, videoFiles, audioFiles, textTrackFiles,
        ...seedOptions
      } = options;

      const {entry} = setGlobals({
        entry: factories.entry(ScrolledEntry, {}, {
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
