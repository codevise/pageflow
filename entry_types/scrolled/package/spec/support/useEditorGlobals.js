import {editor, Site} from 'pageflow/editor';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';

import {setupGlobals} from 'pageflow/testHelpers';
import {factories, normalizeSeed} from 'support';
import I18n from 'i18n-js';

// Required to define editor.entryType global
import 'editor/config';

// Pass server side configs of file types registered by the content
// element editor under test to make them available in created entries:
//
//     useEditorGlobals({
//       fileTypes: [{
//         collectionName: 'lottie_files',
//         typeName: 'PageflowScrolled::LottieFile'
//       }]
//     });
//
// The client side config is taken from the registration of the imported
// module.
export function useEditorGlobals({fileTypes = []} = {}) {
  const {setGlobals} = setupGlobals();

  beforeAll(() => {
    editor.fileTypes.setup(
      [...builtInFileTypes, ...fileTypes].map(completeServerSideConfig)
    );
  });

  beforeEach(() => {
    window.I18n = I18n;
  });

  return {
    createEntry(options) {
      const {
        metadata,
        imageFiles, videoFiles, audioFiles, textTrackFiles,
        filesAttributes,
        site,
        ...seedOptions
      } = options;

      const {entry} = setGlobals({
        entry: factories.entry(ScrolledEntry, {metadata}, {
          site: new Site(site),
          fileTypes: editor.fileTypes,
          filesAttributes: {
            image_files: imageFiles,
            video_files: videoFiles,
            audio_files: audioFiles,
            text_track_files: textTrackFiles,
            ...filesAttributes
          },
          entryTypeSeed: normalizeSeed(seedOptions)
        })
      });

      return entry;
    }
  };
}

const builtInFileTypes = [
  {collectionName: 'image_files', typeName: 'Pageflow::ImageFile'},
  {
    collectionName: 'video_files',
    typeName: 'Pageflow::VideoFile',
    nestedFileTypes: [{collectionName: 'text_track_files'}]
  },
  {
    collectionName: 'audio_files',
    typeName: 'Pageflow::AudioFile',
    nestedFileTypes: [{collectionName: 'text_track_files'}]
  },
  {
    collectionName: 'text_track_files',
    typeName: 'Pageflow::TextTrackFile',
    topLevelType: false
  },
  {collectionName: 'other_files', typeName: 'Pageflow::OtherFile'}
];

// Mirrors how Pageflow::FileType derives these values from the model
// name.
function completeServerSideConfig({collectionName, typeName, topLevelType = true, ...rest}) {
  const underscored = typeName
    .replace(/::/g, '/')
    .replace(/([a-z\d])([A-Z])/g, '$1_$2')
    .toLowerCase();

  return {
    collectionName,
    typeName,
    topLevelType,
    i18nKey: underscored,
    paramKey: underscored.replace(/\//g, '_'),
    ...rest
  };
}
