import React from 'react';
import {useContentElementLifecycle} from 'pageflow-scrolled/frontend';
import {ExternalLink} from './ExternalLink';
import styles from './ExternalLinkList.module.css';

export function ExternalLinkList(props) {
  const linkList = props.configuration.links || [];
  const {isPrepared} = useContentElementLifecycle();

  return (
    <div className={styles.ext_links_container}>
      {linkList.map(function(link, index){
        return <ExternalLink {...link} key={link.id} sectionProps={props.sectionProps} isPrepared={isPrepared} />
      })}
    </div>
  );
}
