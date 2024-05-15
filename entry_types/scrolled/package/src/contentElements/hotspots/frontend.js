import {frontend} from 'pageflow-scrolled/frontend';
import {Hotspots} from './Hotspots';

frontend.contentElementTypes.register('hotspots', {
  component: Hotspots,
  lifecycle: true
});
