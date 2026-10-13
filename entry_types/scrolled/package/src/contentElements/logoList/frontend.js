import {frontend} from 'pageflow-scrolled/frontend';
import {LogoList} from './LogoList';

frontend.contentElementTypes.register('logoList', {
  component: LogoList,
  lifecycle: true
});
