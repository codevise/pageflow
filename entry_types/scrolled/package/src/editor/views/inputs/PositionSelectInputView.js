import React, {useRef} from 'react';
import classNames from 'classnames';
import I18n from 'i18n-js';
import {i18nUtils} from 'pageflow/ui';

import {ListboxInputView} from './ListboxInputView';
import {ContentElementVisualization} from './visualizations/ContentElementVisualization';
import {useScrollAnimation} from './visualizations/useScrollAnimation';

import styles from './PositionSelectInputView.module.css';

export const PositionSelectInputView = ListboxInputView.extend({
  renderItem(item) {
    return (
      <Preview item={item}
               layout={this.options.sectionLayout}
               inlineHelpTranslationKeyPrefix={i18nUtils.findKeyWithTranslation(
                 this.attributeTranslationKeys('item_inline_help_texts')
               )} />
    );
  }
});

function Preview({item, layout, inlineHelpTranslationKeyPrefix}) {
  const ref = useRef();

  const distance = item.value === 'sticky' || item.value === 'standAlone' ? 200 : 100;

  useScrollAnimation(ref, {scrollTop: (scroller, progress) => distance * progress});

  return (
    <div className={styles.outer}>
      <ContentElementVisualization ref={ref}
                                   position={item.value}
                                   layout={layout} />

      <span className={classNames('inline_help', styles.inlineHelp)}>
        {I18n.t(item.value, {scope: inlineHelpTranslationKeyPrefix})}
      </span>

      <div className={styles.description}>
        {item.text}
      </div>
    </div>
  );
}
