import {frontend} from 'pageflow-scrolled/frontend';
import {DataWrapperChart} from './DataWrapperChart';

frontend.contentElementTypes.register('dataWrapperChart', {
  component: DataWrapperChart,
  lifecycle: true
});
