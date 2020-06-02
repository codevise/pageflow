import React from 'react';
import {ExternalLink} from './ExternalLink';
import styles from './ExternalLinkList.module.css';

export function ExternalLinkList(props) {
  var linkList = props.configuration.links || [];

  return (
    <div className={styles.ext_links_container}>
      {linkList.map(function(link, index){
        return <ExternalLink {...link} key={link.id} sectionProps={props.sectionProps}/>
      })}
    </div>
  );
}
