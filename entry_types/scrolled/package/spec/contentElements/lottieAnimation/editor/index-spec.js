import {editor} from 'pageflow-scrolled/editor';

import {useEditorGlobals} from 'support';

import 'contentElements/lottieAnimation/editor';
import {LottieFile} from 'contentElements/lottieAnimation/editor/models/LottieFile';

describe('lottieAnimation/editor', () => {
  useEditorGlobals({
    fileTypes: [{
      collectionName: 'lottie_files',
      typeName: 'PageflowScrolled::LottieFile'
    }]
  });

  it('registers lottie file type for lottie_files collection', () => {
    expect(editor.fileTypes.findByCollectionName('lottie_files').model).toBe(LottieFile);
  });

  it('matches uploads of dotLottie files', () => {
    const fileType = editor.fileTypes.findByUpload({name: 'animation.lottie', type: ''});

    expect(fileType.collectionName).toEqual('lottie_files');
  });

  it('does not match uploads of other files', () => {
    expect(editor.fileTypes.findByUpload({
      name: 'animation.json', type: 'application/json'
    }).collectionName).toEqual('other_files');

    expect(editor.fileTypes.findByUpload({
      name: 'image.jpg', type: 'image/jpeg'
    }).collectionName).toEqual('image_files');
  });
});
