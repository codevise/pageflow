import React, {useState, useCallback} from 'react';
import classNames from 'classnames';
import useScrollPosition from '../useScrollPosition';
import {useChapters} from '../../entryState';
import {useOnUnmuteMedia} from '../useMediaMuted';
import {isBlank} from '../utils/blank';

import {HamburgerIcon} from './HamburgerIcon'
import {ChapterLink} from "./ChapterLink";
import {LegalInfoMenu} from "./LegalInfoMenu";
import {SharingMenu} from "./SharingMenu";
import {ToggleMuteButton} from './ToggleMuteButton';
import {Logo} from './Logo';
import {SkipLinks} from './SkipLinks';
import {Scroller} from './Scroller';

import styles from './AppHeader.module.css';

export function AppHeader(props) {
  const [navExpanded, setNavExpanded] = useState(true);
  const [mobileNavHidden, setMobileNavHidden] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeChapterLink, setActiveChapterLink] = useState('chapterLink1');
  const chapters = useChapters();

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

  useOnUnmuteMedia(useCallback(() => setNavExpanded(true), []));

  const hasChapters = chapters.length > 1 ||
                      !isBlank(chapters[0]?.title) ||
                      !isBlank(chapters[0]?.summary);

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
      );
    });
  };

  function renderNav() {
    if (!hasChapters) {
      return null;
    }

    return (
      <Scroller>
        <nav className={classNames(styles.navigationChapters, {[styles.navigationChaptersHidden]: mobileNavHidden})}
             role="navigation">
          <ul className={styles.chapterList}>
            {renderChapterLinks(chapters)}
          </ul>
        </nav>
      </Scroller>
    );
  }

  return (
    <header className={classNames(styles.navigationBar, {
        [styles.navigationBarExpanded]: navExpanded || !mobileNavHidden,
        [styles.hasChapters]: hasChapters
      })}>
      <div className={styles.navigationBarContentWrapper}>
        {hasChapters && <HamburgerIcon onClick={handleBurgerMenuClick}
                                       mobileNavHidden={mobileNavHidden}/>}

        <SkipLinks />
        <Logo />

        {renderNav()}

        <div className={classNames(styles.contextIcons)}>
          <ToggleMuteButton />
          <LegalInfoMenu />
          <SharingMenu />
        </div>
      </div>

      <div className={styles.progressBar} onMouseEnter={handleProgressBarMouseEnter}>
        <span className={styles.progressIndicator} style={{width: readingProgress + '%'}}/>
      </div>
    </header>
  );
}
