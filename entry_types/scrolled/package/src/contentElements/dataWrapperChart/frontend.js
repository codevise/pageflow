import {frontend} from 'pageflow-scrolled/frontend';
import {features} from 'pageflow/frontend'
import {DataWrapperChart} from './DataWrapperChart';

frontend.contentElementTypes.register('dataWrapperChart', {
  component: DataWrapperChart,
  lifecycle: true,

  consentVendors({configuration, t}) {
    const prefix = 'pageflow_scrolled.public.chart';

    return [{
      name: 'datawrapper',
      displayName: t(`${prefix}.consent_vendor_name`),
      description: t(`${prefix}.consent_vendor_description`),
      paradigm: features.isEnabled('datawrapper_chart_embed_opt_in') ? 'lazy opt-in' : 'skip'
    }];
  }
});
