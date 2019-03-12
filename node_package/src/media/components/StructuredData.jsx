import {isFeatureEnabled} from 'features/selectors';

import {connect} from 'react-redux';
import {combineSelectors} from 'utils';

function StructuredData({data, isEnabled}) {
  if (isEnabled) {
    return (
      <script type="application/ld+json"
              dangerouslySetInnerHTML={{__html: JSON.stringify(data)}} />
    );
  }
  else {
    return null;
  }
}

export default connect(combineSelectors({
  isEnabled: isFeatureEnabled('structured_data')
}))(StructuredData);
