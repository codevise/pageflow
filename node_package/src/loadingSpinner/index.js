import {register as registerClassicLoadingSpinner} from './components/ClassicLoadingSpinner';
import {register as registerTitleLoadingSpinner} from './components/TitleLoadingSpinner';
import {register as registerMediaLoadingSpinner} from './components/MediaLoadingSpinner';
export function registerWidgetTypes() {
  registerClassicLoadingSpinner();
  registerTitleLoadingSpinner();
  registerMediaLoadingSpinner();
}
