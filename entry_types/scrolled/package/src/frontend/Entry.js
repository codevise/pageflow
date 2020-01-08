import React, {useEffect} from 'react';

import styles from './Entry.module.css';
import Chapter from "./Chapter";

export default function Entry(props) {
  const dispatch = props.dispatch;
  const entryStructure = props.entryStructure;

  useEffect(() => {
    if (window.parent) {
      window.addEventListener('message', receive)
      window.parent.postMessage({type: 'READY'}, window.location.origin);
    }

    return () => window.removeEventListener('message', receive);

    function receive(message) {
      if (window.location.href.indexOf(message.origin) === 0 &&
          message.data.type === 'ACTION') {
        dispatch(message.data.payload);
      }
    }
  }, [dispatch]);

  return (
    <div className={styles.Entry}>
      {renderChapters(entryStructure)}
    </div>
  );
}

function renderChapters(entryStructure) {
  return entryStructure.map((chapter, index) => {
    return(
      <Chapter key={index}
               anchor={chapter.title}
               sections={chapter.sections} />
    );
  });
}
