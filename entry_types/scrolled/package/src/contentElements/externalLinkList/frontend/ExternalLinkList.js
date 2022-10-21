import React from 'react';
import classNames from 'classnames';
import {useContentElementLifecycle, useDarkBackground} from 'pageflow-scrolled/frontend';
import {ExternalLink} from './ExternalLink';
import styles from './ExternalLinkList.module.css';

export function ExternalLinkList(props) {
  const linkList = props.configuration.links || [];
  const {shouldLoad} = useContentElementLifecycle();
  const darkBackground = useDarkBackground();

  return (
    <div className={classNames(
      styles.ext_links_container,
      props.configuration.variant &&
      `scope-externalLinkList-${props.configuration.variant}`
    )}>
      {linkList.map((link, index) =>
        <ExternalLink {...link} key={link.id}
                      invert={!darkBackground}
                      sectionProps={props.sectionProps}
                      loadImages={shouldLoad} />
      )}
    </div>
  );
}
