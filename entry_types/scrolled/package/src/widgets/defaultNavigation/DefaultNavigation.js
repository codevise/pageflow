import React, {useState, useCallback} from 'react';
import classNames from 'classnames';

import {
  SelectableWidget,
  WidgetSelectionRect,
  paletteColor,
  useScrollPosition,
  useMainChapters,
  useCurrentChapter,
  useDarkWidgets,
  useIsomorphicLayoutEffect,
  useOnUnmuteMedia,
  usePhonePlatform,
  useShareProviders,
  useTheme,
  utils
} from 'pageflow-scrolled/frontend';

import {HamburgerIcon} from './HamburgerIcon'
import {ChapterLink} from "./ChapterLink";
import {LegalInfoMenu} from "./LegalInfoMenu";
import {TranslationsMenu} from "./TranslationsMenu";
import {SharingMenu} from "./SharingMenu";
import {ToggleMuteButton} from './ToggleMuteButton';
import {Logo} from './Logo';
import {SkipLinks} from './SkipLinks';
import {Scroller} from './Scroller';

import styles from './DefaultNavigation.module.css';

export function DefaultNavigation({
  configuration,
  ExtraButtons, Menu, MobileMenu,
  logo,
  omitChapterNavigation
}) {
  const [navExpanded, setNavExpanded] = useState(true);
  const [menuOpen, setMenuOpen] = useState(!!configuration.defaultMobileNavVisible);
  const [readingProgress, setReadingProgress] = useState(0);

  const chapters = useMainChapters().filter(chapter => !chapter.hideInNavigation);
  const currentChapter = useCurrentChapter();

  const isPhonePlatform = usePhonePlatform();
  const shareProviders = useShareProviders({isPhonePlatform});
  const theme = useTheme();

  const CustomMenu = Menu || MobileMenu;
  const hasMenu = !!CustomMenu;
  const hasDesktopMenu = !!Menu;

  useScrollPosition(
    ({prevPos, currPos}) => {

      const expand = currPos.y > prevPos.y ||
                     // Mobile Safari reports positive scroll position
                     // during scroll bounce animation when scrolling
                     // back to the top. Make sure navigation bar
                     // stays expanded:
                     currPos.y >= 0;
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

  useIsomorphicLayoutEffect(() => {
    document.documentElement.toggleAttribute('data-default-navigation-expanded', navExpanded);

    return () => {
      document.documentElement.removeAttribute('data-default-navigation-expanded');
    };
  }, [navExpanded]);

  const darkWidgets = useDarkWidgets();

  const hasChapters = (chapters.length > 1 ||
                       !utils.isBlank(chapters[0]?.title) ||
                       !utils.isBlank(chapters[0]?.summary)) &&
                      !omitChapterNavigation;

  function handleProgressBarMouseEnter() {
    setNavExpanded(true);
  };

  function handleBurgerMenuClick() {
    setMenuOpen(!menuOpen);
  };

  function handleMenuClick(chapterLinkId) {
    setMenuOpen(false);
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
                       active={currentChapter?.id === chapter.id}
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
        <nav className={classNames(styles.navigationChapters,
                                   {[styles.hiddenOnMobile]: !menuOpen || hasMenu})}>
          <ul className={styles.chapterList}>
            {renderChapterLinks(chapters)}
          </ul>
        </nav>
      </Scroller>
    );
  }

  const hideSharingButton = configuration.hideSharingButton ||
                            !shareProviders.length;

  return (
    <>
      <header className={classNames(styles.navigationBar, {
        'scope-dark': darkWidgets,
        [styles.navigationBarExpanded]: (
          navExpanded ||
          (!isPhonePlatform && configuration.fixedOnDesktop) ||
          menuOpen
        ),
        [styles.hasChapters]: hasChapters,
        [styles.hasDesktopMenu]: hasDesktopMenu
      })} style={{'--theme-accent-color': paletteColor(configuration.accentColor)}}
         onFocus={() => setNavExpanded(true)}>
        <WidgetSelectionRect>
          <div className={styles.navigationBarContentWrapper}>
            <SkipLinks />

            {(hasChapters || hasMenu) && <HamburgerIcon onClick={handleBurgerMenuClick}
                                                        menuOpen={menuOpen}
                                                        visibleOnDesktop={hasDesktopMenu}/>}

            <Logo {...logo} />

            {renderNav()}
            {CustomMenu && <CustomMenu configuration={configuration}
                                       open={menuOpen}
                                       close={() => setMenuOpen(false)} />}

            <div className={classNames(styles.contextIcons)}>
              {!configuration.hideToggleMuteButton && <ToggleMuteButton />}
              <TranslationsMenu />
              {!theme.options.hideLegalInfoButton &&<LegalInfoMenu tooltipOffset={hideSharingButton ? -40 : 0} />}
              {!hideSharingButton && <SharingMenu shareProviders={shareProviders} />}
              {ExtraButtons && <ExtraButtons />}
            </div>
          </div>

          <div className={styles.progressBar} onMouseEnter={handleProgressBarMouseEnter}>
            <span className={styles.progressIndicator} style={{width: readingProgress + '%'}}/>
          </div>
        </WidgetSelectionRect>
      </header>
      <SelectableWidget role="defaultNavigationExtra"
                        props={{navigationExpanded: navExpanded,
                                mobileNavigationVisible: menuOpen}} />
    </>
  );
}
