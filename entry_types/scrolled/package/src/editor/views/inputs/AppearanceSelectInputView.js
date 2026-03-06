import React from 'react';

import {ListboxInputView} from './ListboxInputView';
import {SectionVisualization} from './SectionVisualization';

export const AppearanceSelectInputView = ListboxInputView.extend({
  modelEvents() {
    return {
      ...ListboxInputView.prototype.modelEvents.call(this),
      'change:layout': 'renderDropdown',
      'change:invert': 'renderDropdown',
      'change:exposeMotifArea': 'renderDropdown'
    };
  },

  renderItem(item) {
    const layout = this.model.get('layout') || 'left';
    const isCenter = layout === 'center' || layout === 'centerRagged';

    return (
      <div>
        <SectionVisualization layout={layout}
                        appearance={item.value}
                        invert={this.model.get('invert')}
                        padded={isCenter && this.model.get('exposeMotifArea')} />
        {item.text}
      </div>
    );
  }
});
