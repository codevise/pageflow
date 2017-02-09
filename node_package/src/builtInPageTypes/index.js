import {register as registerAudioPage} from './audio';
import {register as registerPlainPage} from './plain';
import {register as registerVideoPage} from './video';

export function register() {
  registerPlainPage();
  registerVideoPage();
  registerAudioPage();
}
