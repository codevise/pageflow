import React, {useState, useRef} from 'react';
import classNames from 'classnames';
import useScrollPosition from '../useScrollPosition';
import useNativeScrollPrevention from '../useNativeScrollPrevention';

import ChapterLink from "./ChapterLink";

import hamburgerIcons from './hamburgerIcons.module.css'
import styles from './AppHeader.module.css';

import WDRlogo from '../assets/images/navigation/wdr_logo_header.svg';
import ShareIcon from '../assets/images/navigation/icons/share_icon.svg';
import InfoIcon from '../assets/images/navigation/icons/information_icon.svg';

import {useEntryStructure} from '../../entryState';

export default function AppHeader(props) {
  const [navExpanded, setNavExpanded] = useState(true);
  const [mobileNavHidden, setMobileNavHidden] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeChapterLink, setActiveChapterLink] = useState('chapterLink1');
  const entryStructure = useEntryStructure();
  
  const ref = useRef();
  useNativeScrollPrevention(ref);

  const chapters = entryStructure.map((chapter) => {
    return ({
      permaId: chapter.permaId,
      title: chapter.title,
      summary: chapter.summary
    });
  });

  useScrollPosition(
    ({prevPos, currPos}) => {
      const expand = currPos.y > prevPos.y;
      if (expand !== navExpanded) setNavExpanded(expand);
    },
    [navExpanded]
  );

  useScrollPosition(
    ({prevPos, currPos}) => {
      const current = currPos.y * -1;
      // Todo: Memoize and update on window resize
      const total = document.body.clientHeight - window.innerHeight;
      const progress = Math.abs(current / total) * 100;
      setReadingProgress(progress);
    },
    [readingProgress],
    null,
    false,
    1);

  function handleProgressBarMouseEnter() {
    setNavExpanded(true);
  };

  function handleBurgerMenuClick() {
    setMobileNavHidden(!mobileNavHidden);
  };

  function handleMenuClick(chapterLinkId) {
    setActiveChapterLink(chapterLinkId);
    setMobileNavHidden(true);
  };

  function renderMenuLinks(chapters) {
    return chapters.map((chapter, index) => {
      const chapterIndex = index + 1;
      const chapterLinkId = `chapterLink${chapterIndex}`
      return (
        <li key={index} className={styles.chapterListItem}>
          <ChapterLink {...chapter}
                       chapterIndex={chapterIndex}
                       chapterLinkId={chapterLinkId}
                       active={activeChapterLink === chapterLinkId}
                       handleMenuClick={handleMenuClick}/>
        </li>
      )
    })
  };

  return (
    <header className={classNames(styles.navigationBar, {[styles.navigationBarExpanded]: navExpanded})}>
      <div className={styles.navigationBarContentWrapper}>
        <button className={classNames(styles.menuIcon, styles.burgerMenuIcon,
                                      hamburgerIcons.hamburger, hamburgerIcons['hamburger--collapse'],
                                      {[hamburgerIcons['is-active']]: !mobileNavHidden})}
                type="button" onClick={handleBurgerMenuClick}>
          <span className={hamburgerIcons['hamburger-box']}>
            <span className={hamburgerIcons['hamburger-inner']}></span>
          </span>
        </button>

        <WDRlogo className={classNames(styles.wdrLogo)}/>

        <nav className={classNames(styles.navigationChapters, {[styles.navigationChaptersHidden]: mobileNavHidden})}
             role="navigation"
             ref={ref}>
          <ul className={styles.chapterList}>
            {renderMenuLinks(chapters)}
          </ul>
        </nav>

        <a className={classNames(styles.menuIcon, styles.infoIcon)}>
          <InfoIcon/>
        </a>

        <a className={classNames(styles.menuIcon, styles.shareIcon)}>
          <ShareIcon/>
        </a>
      </div>

      <div className={styles.progressBar} onMouseEnter={handleProgressBarMouseEnter}>
        <span className={styles.progressIndicator} style={{width: readingProgress + '%'}}/>
      </div>
    </header>
  );
}
