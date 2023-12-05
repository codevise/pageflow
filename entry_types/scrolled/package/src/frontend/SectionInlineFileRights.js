import React from 'react';
import classNames from 'classnames';

import {InlineFileRights} from './InlineFileRights';

import styles from './SectionInlineFileRights.module.css';

export function SectionInlineFileRights({section, state, backdrop, atmoAudioFile}) {
  return (
    <div className={classNames(styles.wrapper, {
      [styles.fade]: section.nextSection?.transition?.startsWith('fade'),
      [styles.inactive]: state !== 'active'
    })}>
      <InlineFileRights context="section"
                        items={[
                          {label: 'image', file: backdrop.image},
                          {label: 'video', file: backdrop.video},
                          {label: 'atmo', file: atmoAudioFile}
                        ]} />
    </div>
  );
}
