import React, {useEffect, useState} from 'react';

import I18n from 'i18n-js';
import classNames from 'classnames';

import styles from './SkipLinks.module.css';

export function SkipLinks() {
  const [showSkipLinks, setShowSkipLinks] = useState(false);
  const [tabCounter, setTabCounter] = useState(0);

  useEffect(() => {
    const elem = document.getElementById('skipLinks');

    const handleButtonInput = (event) => {
      if(window.scrollY === 0 && window.scrollX === 0){ //Make sure the scroll bar is at the top
  
        if(event.keyCode === 9 && !showSkipLinks && tabCounter === 0) {
          setShowSkipLinks(true);
          setTabCounter(tabCounter + 1);
        }
        else if (event.keyCode === 13 && showSkipLinks){
          elem.click();
          setShowSkipLinks(false);
        }
        else {
          console.log(event.keyCode);
          setShowSkipLinks(false);
        }  
      }
    };

    const handleClick = (event) => {
      const str = event.target.className;

      if (str.indexOf("AppHeader") >= 0) { //Checks if click was in the header section
        setShowSkipLinks(false);
        setTabCounter(0);
      }
      else {
        setShowSkipLinks(false);
      }

      if (str.indexOf('SkipLinks') >= 0) {
        elem.click();
      }
    }

    document.addEventListener("keydown", handleButtonInput);
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener("keydown", handleButtonInput);
      document.removeEventListener('mousedown', handleClick);
    };

  }, [showSkipLinks, tabCounter]);

  //Insert an anchor element into the content to navigate it to.
  useEffect(() => {
    var firstSection = '';
    var node = '';

    setTimeout(() => {
      firstSection = document.getElementsByTagName('section')[0];
      node = document.createElement("a");
      node.setAttribute('id', 'goToContent');
      node.setAttribute('tabindex', '-1');

      if (firstSection) {
        firstSection.prepend(node);
      }
    },
    150);

  }, []);

  return (
    <div className={classNames(styles.skipLinks, showSkipLinks ? '' : styles.hidden)}>
      <a href='#goToContent' tabIndex='1' className={styles.link} id='skipLinks'>
        {I18n.t('pageflow_scrolled.public.navigation_skip_links.content')}
      </a>
    </div>
  );
}
