import React from 'react';
import {useContentElementLifecycle, useDarkBackground} from 'pageflow-scrolled/frontend';
import {ExternalLink} from './ExternalLink';
import styles from './ExternalLinkList.module.css';

export function ExternalLinkList(props) {
  const linkList = props.configuration.links || [];
  const {isPrepared} = useContentElementLifecycle();
  const darkBackground = useDarkBackground();

  return (
    <div className={styles.ext_links_container}>
      {linkList.map((link, index) =>
        <ExternalLink {...link} key={link.id}
                      invert={!darkBackground}
                      sectionProps={props.sectionProps}
                      isPrepared={isPrepared} />
      )}
    </div>
  );
}
