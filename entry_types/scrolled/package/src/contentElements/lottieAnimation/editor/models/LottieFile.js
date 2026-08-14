import {UploadableFile} from 'pageflow/editor';

// Registering a file type sets model naming on the prototype of its
// model, which requires a class of its own even though the thumbnail
// and preview views cover everything specific to lottie files.
export const LottieFile = UploadableFile.extend({});
