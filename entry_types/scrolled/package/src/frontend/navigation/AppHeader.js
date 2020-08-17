import React, {useState, useRef} from 'react';
import classNames from 'classnames';
import useScrollPosition from '../useScrollPosition';
import useNativeScrollPrevention from '../useNativeScrollPrevention';
import {useEntryStructure} from '../../entryState';

import {HamburgerIcon} from './HamburgerIcon'
import {ChapterLink} from "./ChapterLink";
import {LegalInfoMenu} from "./LegalInfoMenu";
import {SharingMenu} from "./SharingMenu";
import {Logo} from './Logo';

import styles from './AppHeader.module.css';

export function AppHeader(props) {
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
      const progress = Math.min(100, Math.abs(current / total) * 100);
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

  function renderChapterLinks(chapters) {
    return chapters.filter(function (chapterConfiguration) {
      return chapterConfiguration.title && chapterConfiguration.summary;
    }).map((chapter, index) => {
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
    <header
      className={classNames(styles.navigationBar, {[styles.navigationBarExpanded]: navExpanded})}>
      <div className={styles.navigationBarContentWrapper}>
        <HamburgerIcon onClick={handleBurgerMenuClick}
                       mobileNavHidden={mobileNavHidden}/>

        <Logo />

        <nav className={classNames(styles.navigationChapters, {[styles.navigationChaptersHidden]: mobileNavHidden})}
             role="navigation"
             ref={ref}>
          <ul className={styles.chapterList}>
            {renderChapterLinks(chapters)}
          </ul>
        </nav>

        <div className={classNames(styles.contextIcons)}>
          <SharingMenu />
          <LegalInfoMenu />
        </div>
      </div>

      <div className={styles.progressBar} onMouseEnter={handleProgressBarMouseEnter}>
        <span className={styles.progressIndicator} style={{width: readingProgress + '%'}}/>
      </div>
    </header>
  );
}
