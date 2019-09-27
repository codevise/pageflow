import {register as registerClassicLoadingSpinner} from './components/ClassicLoadingSpinner';
import {register as registerMediaLoadingSpinner} from './components/MediaLoadingSpinner';
import {register as registerTitleLoadingSpinner} from './components/TitleLoadingSpinner';
export function registerWidgetTypes() {
  registerClassicLoadingSpinner();
  registerTitleLoadingSpinner();
  registerMediaLoadingSpinner();
}
