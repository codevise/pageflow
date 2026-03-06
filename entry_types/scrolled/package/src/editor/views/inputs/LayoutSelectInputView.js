import React from 'react';

import {ListboxInputView} from './ListboxInputView';
import {SectionVisualization} from './SectionVisualization';

export const LayoutSelectInputView = ListboxInputView.extend({
  modelEvents() {
    return {
      ...ListboxInputView.prototype.modelEvents.call(this),
      'change:appearance': 'renderDropdown',
      'change:invert': 'renderDropdown',
      'change:exposeMotifArea': 'renderDropdown'
    };
  },

  renderItem(item) {
    const appearance = this.model.get('appearance') || 'shadow';
    const isCenter = item.value === 'center' || item.value === 'centerRagged';

    return (
      <div>
        <SectionVisualization layout={item.value}
                        appearance={appearance}
                        invert={this.model.get('invert')}
                        padded={isCenter && this.model.get('exposeMotifArea')} />
        {item.text}
      </div>
    );
  }
});
