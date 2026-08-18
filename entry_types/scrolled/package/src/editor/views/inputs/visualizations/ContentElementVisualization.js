import React, {forwardRef} from 'react';
import classNames from 'classnames';

import styles from './ContentElementVisualization.module.css';

// Illustrates how a content element behaves while the page scrolls,
// by rendering a miniature of the section it sits in. Children are
// rendered inside the rectangle representing the content element.
export const ContentElementVisualization = forwardRef(function ContentElementVisualization(
  {position, layout, children}, ref
) {
  return (
    <div ref={ref}
         className={classNames(styles.visualization,
                               styles[`${position}Position`],
                               styles[`${layout}Layout`])}
         aria-hidden="true">
      <div className={styles.section}>
        <div className={styles.content}>
          <TextBlock words={40} />
        </div>
        <div className={styles.group}>
          <div className={styles.wrapper}>
            <div className={styles.block}>
              {children}
            </div>
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
  );
});

function TextBlock({words}) {
  return (
    <div className={styles.textBlock}>
      {Array(words).fill().map((i, index) =>
        <div key={index} className={styles.textBlockWord} />
      )}
    </div>
  );
}
