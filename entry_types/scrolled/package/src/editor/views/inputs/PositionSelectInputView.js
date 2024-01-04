import React, {useRef, useEffect} from 'react';
import classNames from 'classnames';
import I18n from 'i18n-js';
import {i18nUtils} from 'pageflow/ui';

import {ListboxInputView} from './ListboxInputView';

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

const duration = 3000;

function Preview({item, layout, inlineHelpTranslationKeyPrefix}) {
  const ref = useRef();
  const dist = item.value === 'sticky' || item.value === 'standAlone' ? 200 : 100;

  useEffect(() => {
    let startTime = new Date().getTime();

    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      let t = (currentTime - startTime) % (2 * duration);

      if (t > duration) {
        t = duration - (t - duration);
      }

      ref.current.scrollTop = dist * easeInOut(t / duration);
    }, 10);

    return () => clearInterval(interval);
  }, [dist]);

  return (
    <div className={styles.outer}>
      <div ref={ref}
           className={classNames(styles.preview,
                                 styles[`${item.value}Position`],
                                 styles[`${layout}Layout`])}
           aria-hidden="true">
        <div className={styles.section}>
          <div className={styles.content}>
            <TextBlock words={40} />
          </div>
          <div className={styles.group}>
            <div className={styles.wrapper}>
              <div className={styles.block} />
            </div>

            <div className={styles.content}>
              <TextBlock words={30} />
              <TextBlock words={40} />
            </div>
          </div>
          <div className={styles.content}>
            <TextBlock words={70} />
          </div>
        </div>
      </div>

      <span className={classNames('inline_help', styles.inlineHelp)}>
        {I18n.t(item.value, {scope: inlineHelpTranslationKeyPrefix})}
      </span>

      <div className={styles.description}>
        {item.text}
      </div>
    </div>
  );
}

function TextBlock({words}) {
  return (
    <div className={styles.textBlock}>
      {Array(words).fill().map((i, index) =>
        <div key={index} className={styles.textBlockWord} />
      )}
    </div>
  );
}

function easeInOut(t) {
  t = t * 2;
  if (t < 1) return (t**2)/2;
  t = t - 1;
  return t - (t**2)/2 + 1/2;
};
