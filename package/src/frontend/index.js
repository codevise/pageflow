import './polyfills';
import {Consent} from './Consent';

export {log, debugMode} from './base';
export * from './assetUrls';
export * from './cookies';
export * from './events';
export * from './browser';
export * from './features';
export * from './Audio';
export * from './AudioPlayer';

export * from './audioContext';
export * from './mediaPlayer';
export * from './VideoPlayer';

export * from './media';

export * from './settings';

export * from './documentHiddenState';

export {Consent} from './Consent';
export const consent = Consent.create();
