import { useTheme, useI18n, ThemeIcon, Tooltip, utils, useFileRights, useLegalInfo, usePrivacyLink, useCredits, Widget, useEntryMetadata, useEntryTranslations, useShareUrl, useMediaMuted, useOnUnmuteMedia, useDarkWidgets, usePhonePlatform, useScrollPosition, useMainChapters, useCurrentChapter, useShareProviders, paletteColor, WidgetSelectionRect, SelectableWidget, frontend } from 'pageflow-scrolled/frontend';
import React, { useRef, useEffect, useCallback, createContext, useState, useMemo, useContext } from 'react';
import classNames from 'classnames';
import { media } from 'pageflow/frontend';
import Measure from 'react-measure';

var styles = {"breakpoint-below-md":"(max-width: 767px)","navigationBar":"DefaultNavigation-module_navigationBar__2RK0h scope-defaultNavigation","contextIcons":"DefaultNavigation-module_contextIcons__2e65s","navigationBarExpanded":"DefaultNavigation-module_navigationBarExpanded__C3sLq","navigationBarContentWrapper":"DefaultNavigation-module_navigationBarContentWrapper__3narH","translucentSurface":"DefaultNavigation-module_translucentSurface__3HK6B widgets-module_translucentWidgetSurface__kYVg7","opaqueSurface":"DefaultNavigation-module_opaqueSurface__24o-m","button":"DefaultNavigation-module_button__3QCuK utils-module_unstyledButton__3rgne","menuIcon":"DefaultNavigation-module_menuIcon__2bb8s DefaultNavigation-module_button__3QCuK utils-module_unstyledButton__3rgne","contextIcon":"DefaultNavigation-module_contextIcon__ELsqa DefaultNavigation-module_button__3QCuK utils-module_unstyledButton__3rgne","logo":"DefaultNavigation-module_logo__3gUbx","hasDesktopMenu":"DefaultNavigation-module_hasDesktopMenu__195sb","chapterList":"DefaultNavigation-module_chapterList__3VoXX scope-defaultNavigationChapterList","chapterListItem":"DefaultNavigation-module_chapterListItem__1YF5e","navigationTooltip":"DefaultNavigation-module_navigationTooltip__26Fvn","progressBar":"DefaultNavigation-module_progressBar__1jvov","progressIndicator":"DefaultNavigation-module_progressIndicator__2d_e3","hasChapters":"DefaultNavigation-module_hasChapters__3ab-r","centerMobileLogo":"DefaultNavigation-module_centerMobileLogo__3jtk3","navigationChapters":"DefaultNavigation-module_navigationChapters__3M6zh","hiddenOnMobile":"DefaultNavigation-module_hiddenOnMobile__2c5WI"};

var styles$1 = {"breakpoint-md":"(min-width: 768px)","burgerMenuIconContainer":"HamburgerIcon-module_burgerMenuIconContainer__3aBkk","visibleOnDesktop":"HamburgerIcon-module_visibleOnDesktop__2HgR0","small":"HamburgerIcon-module_small__asAkY"};

var hamburgerIconStyles = {"hamburger":"HamburgerIcons-module_hamburger__SOreS","is-active":"HamburgerIcons-module_is-active__2jpzX","hamburger-inner":"HamburgerIcons-module_hamburger-inner__Wv7Dn","hamburger-box":"HamburgerIcons-module_hamburger-box__10MR1","hamburger--collapse":"HamburgerIcons-module_hamburger--collapse__1xOkf"};

function HamburgerIcon({
  menuOpen,
  onClick,
  visibleOnDesktop
}) {
  const theme = useTheme();
  const {
    t
  } = useI18n();
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$1.burgerMenuIconContainer, {
      [styles$1.visibleOnDesktop]: visibleOnDesktop
    })
  }, /*#__PURE__*/React.createElement("button", {
    className: styles.menuIcon,
    title: menuOpen ? t('pageflow_scrolled.public.navigation.close_mobile_menu') : t('pageflow_scrolled.public.navigation.open_mobile_menu'),
    type: "button",
    onClick: onClick
  }, /*#__PURE__*/React.createElement(ThemeIcon, {
    name: "menu",
    renderFallback: () => /*#__PURE__*/React.createElement("span", {
      className: classNames(hamburgerIconStyles.hamburger, hamburgerIconStyles['hamburger--collapse'], {
        [styles$1.small]: theme.options.defaultNavigationMenuIconVariant === 'small'
      }, {
        [hamburgerIconStyles['is-active']]: menuOpen
      })
    }, /*#__PURE__*/React.createElement("span", {
      className: hamburgerIconStyles['hamburger-box']
    }, /*#__PURE__*/React.createElement("span", {
      className: hamburgerIconStyles['hamburger-inner']
    })))
  })));
}

var styles$2 = {"breakpoint-md":"(min-width: 768px)","chapterLink":"ChapterLink-module_chapterLink__3YspQ typography-defaultNavigationChapterLink","chapterLinkActive":"ChapterLink-module_chapterLinkActive__9i8SL typography-defaultNavigationActiveChapterLink","summary":"ChapterLink-module_summary__2ZfRU typography-defaultNavigationChapterSummary","inlineSummary":"ChapterLink-module_inlineSummary__2Mhk-","tooltipBubble":"ChapterLink-module_tooltipBubble__3VRUO"};

const {
  isBlank,
  presence
} = utils;
function ChapterLink(props) {
  const {
    t
  } = useI18n();
  const renderLink = (triggerProps = {}) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", Object.assign({}, triggerProps, {
    className: classNames(styles$2.chapterLink, {
      [styles$2.chapterLinkActive]: props.active
    }),
    href: `#${props.chapterSlug}`,
    onClick: () => props.handleMenuClick(props.chapterLinkId),
    "aria-current": props.active ? 'location' : undefined
  }), presence(props.title) || t('pageflow_scrolled.public.navigation.chapter', {
    number: props.chapterIndex
  })), !isBlank(props.summary) && /*#__PURE__*/React.createElement("p", {
    className: classNames(styles$2.summary, styles$2.inlineSummary),
    dangerouslySetInnerHTML: {
      __html: props.summary
    }
  }));
  if (isBlank(props.summary)) {
    return renderLink();
  }
  const content = /*#__PURE__*/React.createElement("p", {
    className: styles$2.summary,
    dangerouslySetInnerHTML: {
      __html: props.summary
    }
  });
  return /*#__PURE__*/React.createElement(Tooltip, {
    name: `chapter-${props.chapterLinkId}`,
    content: content,
    openOnHover: true,
    highlight: true,
    bubbleClassName: styles$2.tooltipBubble
  }, renderLink);
}

var styles$3 = {"legalInfoTooltip":"LegalInfoMenu-module_legalInfoTooltip__Qmf8u","scroller":"LegalInfoMenu-module_scroller__3NPW_","links":"LegalInfoMenu-module_links__1kpsd","separator":"LegalInfoMenu-module_separator__3mmjA","section":"LegalInfoMenu-module_section__1bLWD","legalInfoLink":"LegalInfoMenu-module_legalInfoLink__gkXaF","rights":"LegalInfoMenu-module_rights__-XGYO"};

const defaultProps = {
  target: '_blank',
  rel: 'noreferrer noopener'
};
function LegalInfoLink({
  label,
  url,
  props
}) {
  return /*#__PURE__*/React.createElement("div", null, label && url && /*#__PURE__*/React.createElement("a", Object.assign({
    href: url
  }, props || defaultProps, {
    className: styles$3.legalInfoLink,
    dangerouslySetInnerHTML: {
      __html: label
    }
  })));
}

function LegalInfoMenu(props) {
  const fileRights = useFileRights();
  const legalInfo = useLegalInfo();
  const privacyLink = usePrivacyLink();
  const credits = useCredits();
  const {
    t
  } = useI18n();
  const content = /*#__PURE__*/React.createElement("div", {
    className: styles$3.legalInfoTooltip
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$3.scroller
  }, credits && /*#__PURE__*/React.createElement("p", {
    className: styles$3.section,
    dangerouslySetInnerHTML: {
      __html: credits
    }
  }), fileRights.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: styles$3.section
  }, /*#__PURE__*/React.createElement("strong", null, t('pageflow_scrolled.public.media')), " ", renderFileRights(fileRights))), /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$3.links, {
      [styles$3.separator]: credits || fileRights.length > 0
    })
  }, /*#__PURE__*/React.createElement(LegalInfoLink, legalInfo.imprint), /*#__PURE__*/React.createElement(LegalInfoLink, legalInfo.copyright), /*#__PURE__*/React.createElement(LegalInfoLink, privacyLink)), /*#__PURE__*/React.createElement(Widget, {
    role: "creditsBoxFooter"
  }));
  return /*#__PURE__*/React.createElement(Tooltip, {
    name: "legalInfo",
    horizontalOffset: props.tooltipOffset - 30,
    arrowPos: 120 - props.tooltipOffset,
    content: content
  }, triggerProps => /*#__PURE__*/React.createElement("button", Object.assign({}, triggerProps, {
    className: classNames(styles.contextIcon),
    title: t('pageflow_scrolled.public.navigation.legal_info')
  }), /*#__PURE__*/React.createElement(ThemeIcon, {
    name: "information"
  })));
}
function renderFileRights(items) {
  return /*#__PURE__*/React.createElement("ul", {
    className: styles$3.rights
  }, items.map((item, index) => /*#__PURE__*/React.createElement("li", {
    key: index
  }, index > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, "\xA0| "), renderFileRightsText(item))));
}
function renderFileRightsText(item) {
  if (item.urls.length > 1) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, item.text, " (", item.urls.flatMap((url, index) => [index > 0 && ', ', /*#__PURE__*/React.createElement("a", {
      href: url,
      target: "_blank",
      rel: "noopener noreferrer",
      key: index
    }, index + 1)]), ")");
  } else if (item.urls.length === 1) {
    return /*#__PURE__*/React.createElement("a", {
      href: item.urls[0],
      target: "_blank",
      rel: "noopener noreferrer"
    }, item.text);
  } else {
    return item.text;
  }
}

var styles$4 = {"tooltip":"TranslationsMenu-module_tooltip__g1k9g","list":"TranslationsMenu-module_list__2zLEz","tag":"TranslationsMenu-module_tag__xRYH9"};

function TranslationsMenu({
  tooltipOffset = 0
}) {
  const {
    t
  } = useI18n();
  const entry = useEntryMetadata();
  const translations = useEntryTranslations();
  if (translations.length < 2) {
    return null;
  }
  const content = /*#__PURE__*/React.createElement("div", {
    className: styles$4.tooltip
  }, /*#__PURE__*/React.createElement("ul", {
    className: styles$4.list
  }, translations.map(({
    id,
    url,
    displayLocale
  }) => {
    if (entry.id === id) {
      return /*#__PURE__*/React.createElement("li", {
        key: id,
        "aria-current": "page"
      }, /*#__PURE__*/React.createElement("strong", null, displayLocale));
    } else {
      return /*#__PURE__*/React.createElement("li", {
        key: id
      }, /*#__PURE__*/React.createElement("a", {
        target: "_top",
        href: url
      }, displayLocale));
    }
  })));
  return /*#__PURE__*/React.createElement(Tooltip, {
    name: "translations",
    horizontalOffset: tooltipOffset - 30,
    arrowPos: 120 - tooltipOffset,
    content: content
  }, triggerProps => /*#__PURE__*/React.createElement("button", Object.assign({}, triggerProps, {
    className: classNames(styles.contextIcon),
    title: t('pageflow_scrolled.public.navigation.language')
  }), /*#__PURE__*/React.createElement(ThemeIcon, {
    name: "world"
  }), /*#__PURE__*/React.createElement("div", {
    className: styles$4.tag
  }, /*#__PURE__*/React.createElement("span", null, entry.locale.substring(0, 2).toUpperCase()))));
}

var styles$5 = {"sharingTooltip":"SharingMenu-module_sharingTooltip__2Tyev","shareLinkContainer":"SharingMenu-module_shareLinkContainer__3-3W6","shareLink":"SharingMenu-module_shareLink__3PdRE"};

function SharingMenu({
  shareProviders
}) {
  const shareUrl = useShareUrl();
  const {
    t
  } = useI18n();
  function renderShareLinks(shareProviders) {
    return shareProviders.map(shareProvider => {
      return /*#__PURE__*/React.createElement("div", {
        key: shareProvider.name,
        className: styles$5.shareLinkContainer
      }, /*#__PURE__*/React.createElement("a", {
        className: classNames('share', styles$5.shareLink),
        href: shareProvider.url.replace('%<url>s', shareUrl),
        target: '_blank',
        rel: "noopener noreferrer"
      }, /*#__PURE__*/React.createElement(ThemeIcon, {
        name: shareProvider.iconName
      }), shareProvider.name));
    });
  }
  return /*#__PURE__*/React.createElement(Tooltip, {
    name: "sharing",
    horizontalOffset: -70,
    arrowPos: 160,
    content: renderShareLinks(shareProviders)
  }, triggerProps => /*#__PURE__*/React.createElement("button", Object.assign({}, triggerProps, {
    className: classNames(styles.contextIcon),
    title: t('pageflow_scrolled.public.navigation.share')
  }), /*#__PURE__*/React.createElement(ThemeIcon, {
    name: "share"
  })));
}

var styles$6 = {"button":"ToggleMuteButton-module_button__1ACmo","animate":"ToggleMuteButton-module_animate__pd1yK","pulse":"ToggleMuteButton-module_pulse__2UN7Q"};

function ToggleMuteButton() {
  const muted = useMediaMuted();
  const {
    t
  } = useI18n();
  useUnmuteSound();
  return /*#__PURE__*/React.createElement("div", {
    className: classNames({
      [styles$6.animate]: !muted
    })
  }, /*#__PURE__*/React.createElement("button", {
    className: classNames(styles.contextIcon, styles$6.button),
    title: muted ? t('pageflow_scrolled.public.navigation.unmute') : t('pageflow_scrolled.public.navigation.mute'),
    onClick: () => media.mute(!muted)
  }, muted ? /*#__PURE__*/React.createElement(ThemeIcon, {
    name: "muted"
  }) : /*#__PURE__*/React.createElement(ThemeIcon, {
    name: "unmuted"
  })));
}
function useUnmuteSound() {
  const theme = useTheme();
  const audio = useRef();
  useEffect(() => {
    audio.current = new Audio(theme.assets.unmute);
  }, [theme.assets.unmute]);
  useOnUnmuteMedia(useCallback(() => audio.current.play(), []));
}

function Logo({
  srcMobile,
  srcDesktop,
  url,
  altText
}) {
  const theme = useTheme();
  const darkWidgets = useDarkWidgets();
  srcDesktop = srcDesktop || (darkWidgets ? theme.assets.logoDarkVariantDesktop : theme.assets.logoDesktop);
  srcMobile = srcMobile || (darkWidgets ? theme.assets.logoDarkVariantMobile : theme.assets.logoMobile);
  const inIframe = typeof window !== 'undefined' && window.parent !== window;
  return /*#__PURE__*/React.createElement("a", {
    target: inIframe || !theme.options.logoOpenInSameTab ? "_blank" : null,
    rel: "noopener noreferrer",
    href: url || theme.options.logoUrl,
    className: classNames(styles.logo, {
      [styles.centerMobileLogo]: theme.options.defaultNavigationMobileLogoPosition === 'center'
    })
  }, /*#__PURE__*/React.createElement("picture", null, /*#__PURE__*/React.createElement("source", {
    media: "(max-width: 780px)",
    srcSet: srcMobile
  }), /*#__PURE__*/React.createElement("source", {
    media: "(min-width: 781px)",
    srcSet: srcDesktop
  }), /*#__PURE__*/React.createElement("img", {
    src: srcDesktop,
    alt: altText || theme.options.logoAltText
  })));
}

var styles$7 = {"link":"SkipLinks-module_link__HMj9l"};

function SkipLinks() {
  const {
    t
  } = useI18n();
  function scrollDown() {
    setTimeout(() => {
      window.scrollTo(0, 50);
    }, 50);
  }
  return /*#__PURE__*/React.createElement("div", {
    id: "skipLinks"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#goToContent",
    className: styles$7.link,
    onClick: scrollDown
  }, t('pageflow_scrolled.public.navigation_skip_links.content')));
}

var styles$8 = {"button":"ScrollButton-module_button__1GKRF utils-module_unstyledButton__3rgne","visible":"ScrollButton-module_visible__29yco","start":"ScrollButton-module_start__1XPra ScrollButton-module_button__1GKRF utils-module_unstyledButton__3rgne","end":"ScrollButton-module_end__3PxQt ScrollButton-module_button__1GKRF utils-module_unstyledButton__3rgne"};

function ScrollButton({
  type,
  contentRect,
  onStep
}) {
  const visible = type === 'start' ? contentRect.scroll.left > 0 : contentRect.scroll.width > contentRect.client.width && contentRect.scroll.left < contentRect.scroll.width - contentRect.client.width;
  const step = type === 'start' ? -100 : 100;
  const interval = useRef();
  return /*#__PURE__*/React.createElement("button", {
    className: classNames({
      [styles$8.start]: type === 'start',
      [styles$8.end]: type === 'end',
      [styles$8.visible]: visible
    }),
    onMouseDown: handleMouseDown,
    onKeyPress: handleKeyPress
  }, /*#__PURE__*/React.createElement(ThemeIcon, {
    name: type === 'start' ? 'arrowLeft' : 'arrowRight'
  }));
  function handleMouseDown(event) {
    if (event.button === 0) {
      scrollUntilMouseUp();
    }
  }
  function scrollUntilMouseUp() {
    scrollStep();
    clearInterval(interval.current);
    interval.current = setInterval(() => scrollStep(), 400);
    document.addEventListener('mouseup', stopScrolling);
    function stopScrolling() {
      document.removeEventListener('mouseup', stopScrolling);
      clearInterval(interval.current);
    }
  }
  function handleKeyPress(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      scrollStep();
    }
  }
  function scrollStep() {
    onStep(step);
  }
}

var styles$9 = {"breakpoint-md":"(min-width: 768px)","scroller":"Scroller-module_scroller__139cK","inner":"Scroller-module_inner__3dhuM"};

function Scroller({
  children
}) {
  const ref = useRef();
  return /*#__PURE__*/React.createElement(Measure, {
    scroll: true,
    client: true,
    innerRef: ref
  }, ({
    contentRect,
    measureRef,
    measure
  }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ScrollButton, {
    type: "start",
    contentRect: contentRect,
    onStep: scrollBy
  }), /*#__PURE__*/React.createElement(ScrollButton, {
    type: "end",
    contentRect: contentRect,
    onStep: scrollBy
  }), /*#__PURE__*/React.createElement("div", {
    className: styles$9.scroller,
    ref: measureRef,
    onFocus: scrollTargetIntoView,
    onScroll: () => measure()
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$9.inner
  }, children))));
  function scrollBy(x) {
    // IE11 does not support scrollBy
    ref.current.scrollLeft = ref.current.scrollLeft + x;
  }
  function scrollTargetIntoView(event) {
    const targetBounds = event.target.getBoundingClientRect();
    const scrollerClipRight = ref.current.clientWidth * 0.75;
    const scrollerClipLeft = ref.current.clientWidth * 0.25;
    if (targetBounds.left < scrollerClipLeft) {
      scrollBy(targetBounds.left - scrollerClipLeft);
    } else if (targetBounds.right > scrollerClipRight) {
      scrollBy(targetBounds.right - scrollerClipRight);
    }
  }
}

function useTimeoutFlag(duration) {
  const flagRef = useRef(false);
  const timeoutRef = useRef(null);
  const activate = useCallback(() => {
    flagRef.current = true;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      flagRef.current = false;
    }, duration);
  }, [duration]);
  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);
  return [flagRef, activate];
}

var styles$a = {"widgetMarginMax":"presenceClassNames-module_widgetMarginMax__24HYl","expanded":"presenceClassNames-module_expanded__mPGsi","widgetMarginMin":"presenceClassNames-module_widgetMarginMin__2D3cx"};

const DefaultNavigationContext = createContext({
  navExpanded: true,
  setNavExpanded: () => {}
});
function useDefaultNavigationState() {
  return useContext(DefaultNavigationContext);
}
function DefaultNavigationPresenceProvider({
  configuration,
  children
}) {
  const [navExpanded, setNavExpanded] = useState(true);
  const isPhonePlatform = usePhonePlatform();
  const [scrollLockRef, activateScrollLock] = useTimeoutFlag(200);
  const lockNavExpanded = useCallback(() => {
    activateScrollLock();
    setNavExpanded(true);
  }, [activateScrollLock]);
  useScrollPosition(({
    prevPos,
    currPos
  }) => {
    if (scrollLockRef.current) return;
    const expand = currPos.y > prevPos.y ||
    // Mobile Safari reports positive scroll position
    // during scroll bounce animation when scrolling
    // back to the top. Make sure navigation bar
    // stays expanded:
    currPos.y >= 0;
    if (expand !== navExpanded) setNavExpanded(expand);
  }, [navExpanded]);
  useOnUnmuteMedia(useCallback(() => setNavExpanded(true), []));
  const alwaysExpanded = !isPhonePlatform && configuration.fixedOnDesktop;
  const expanded = navExpanded || alwaysExpanded;
  const className = classNames(styles$a.widgetMarginMax, {
    [styles$a.widgetMarginMin]: configuration.firstBackdropBelowNavigation && configuration.fixedOnDesktop && !isPhonePlatform,
    [styles$a.expanded]: expanded
  });
  const contextValue = useMemo(() => ({
    navExpanded,
    setNavExpanded,
    lockNavExpanded
  }), [navExpanded, lockNavExpanded]);
  return /*#__PURE__*/React.createElement(DefaultNavigationContext.Provider, {
    value: contextValue
  }, /*#__PURE__*/React.createElement("div", {
    className: className
  }, children));
}

function DefaultNavigation({
  configuration,
  ExtraButtons,
  Menu,
  MobileMenu,
  logo,
  omitChapterNavigation
}) {
  var _chapters$, _chapters$2;
  const {
    navExpanded,
    setNavExpanded,
    lockNavExpanded
  } = useDefaultNavigationState();
  const [menuOpen, setMenuOpen] = useState(!!configuration.defaultMobileNavVisible);
  const [readingProgress, setReadingProgress] = useState(0);
  const chapters = useMainChapters().filter(chapter => !chapter.hideInNavigation);
  const currentChapter = useCurrentChapter();
  const isPhonePlatform = usePhonePlatform();
  const shareProviders = useShareProviders({
    isPhonePlatform
  });
  const theme = useTheme();
  const CustomMenu = Menu || MobileMenu;
  const hasMenu = !!CustomMenu;
  const hasDesktopMenu = !!Menu;
  useScrollPosition(({
    prevPos,
    currPos
  }) => {
    const current = currPos.y * -1;
    // Todo: Memoize and update on window resize
    const total = document.body.clientHeight - window.innerHeight;
    const progress = Math.min(100, Math.abs(current / total) * 100);
    setReadingProgress(progress);
  }, [readingProgress], null, false, 1);
  const darkWidgets = useDarkWidgets();
  const hasChapters = (chapters.length > 1 || !utils.isBlank((_chapters$ = chapters[0]) === null || _chapters$ === void 0 ? void 0 : _chapters$.title) || !utils.isBlank((_chapters$2 = chapters[0]) === null || _chapters$2 === void 0 ? void 0 : _chapters$2.summary)) && !omitChapterNavigation;
  function handleProgressBarMouseEnter() {
    setNavExpanded(true);
  }
  function handleBurgerMenuClick() {
    setMenuOpen(!menuOpen);
  }
  function handleMenuClick(chapterLinkId) {
    lockNavExpanded();
    setMenuOpen(false);
  }
  function renderChapterLinks(chapters) {
    return chapters.map((chapter, index) => {
      const chapterIndex = index + 1;
      const chapterLinkId = `chapterLink${chapterIndex}`;
      return /*#__PURE__*/React.createElement("li", {
        key: index,
        className: styles.chapterListItem
      }, /*#__PURE__*/React.createElement(ChapterLink, Object.assign({}, chapter, {
        chapterIndex: chapterIndex,
        chapterLinkId: chapterLinkId,
        active: (currentChapter === null || currentChapter === void 0 ? void 0 : currentChapter.id) === chapter.id,
        handleMenuClick: handleMenuClick
      })));
    });
  }
  function renderNav() {
    if (!hasChapters) {
      return null;
    }
    return /*#__PURE__*/React.createElement(Scroller, null, /*#__PURE__*/React.createElement("nav", {
      className: classNames(styles.navigationChapters, {
        [styles.hiddenOnMobile]: !menuOpen || hasMenu
      })
    }, /*#__PURE__*/React.createElement("ul", {
      className: styles.chapterList
    }, renderChapterLinks(chapters))));
  }
  const hideSharingButton = configuration.hideSharingButton || !shareProviders.length;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("header", {
    className: classNames(styles.navigationBar, {
      'scope-dark': darkWidgets,
      [styles.navigationBarExpanded]: navExpanded || !isPhonePlatform && configuration.fixedOnDesktop || menuOpen,
      [styles.hasChapters]: hasChapters,
      [styles.hasDesktopMenu]: hasDesktopMenu
    }),
    style: {
      '--theme-accent-color': paletteColor(configuration.accentColor)
    },
    onFocus: () => setNavExpanded(true)
  }, /*#__PURE__*/React.createElement(WidgetSelectionRect, null, /*#__PURE__*/React.createElement("div", {
    className: classNames(styles.navigationBarContentWrapper, configuration.firstBackdropBelowNavigation ? styles.opaqueSurface : styles.translucentSurface)
  }, /*#__PURE__*/React.createElement(SkipLinks, null), (hasChapters || hasMenu) && /*#__PURE__*/React.createElement(HamburgerIcon, {
    onClick: handleBurgerMenuClick,
    menuOpen: menuOpen,
    visibleOnDesktop: hasDesktopMenu
  }), /*#__PURE__*/React.createElement(Logo, logo), renderNav(), CustomMenu && /*#__PURE__*/React.createElement(CustomMenu, {
    configuration: configuration,
    open: menuOpen,
    close: () => setMenuOpen(false)
  }), /*#__PURE__*/React.createElement("div", {
    className: classNames(styles.contextIcons)
  }, !configuration.hideToggleMuteButton && /*#__PURE__*/React.createElement(ToggleMuteButton, null), /*#__PURE__*/React.createElement(TranslationsMenu, null), !theme.options.hideLegalInfoButton && /*#__PURE__*/React.createElement(LegalInfoMenu, {
    tooltipOffset: hideSharingButton ? -40 : 0
  }), !hideSharingButton && /*#__PURE__*/React.createElement(SharingMenu, {
    shareProviders: shareProviders
  }), ExtraButtons && /*#__PURE__*/React.createElement(ExtraButtons, null))), /*#__PURE__*/React.createElement("div", {
    className: styles.progressBar,
    onMouseEnter: handleProgressBarMouseEnter
  }, /*#__PURE__*/React.createElement("span", {
    className: styles.progressIndicator,
    style: {
      width: readingProgress + '%'
    }
  })))), /*#__PURE__*/React.createElement(SelectableWidget, {
    role: "defaultNavigationExtra",
    props: {
      navigationExpanded: navExpanded,
      mobileNavigationVisible: menuOpen
    }
  }));
}

frontend.widgetTypes.register('defaultNavigation', {
  component: DefaultNavigation,
  presenceProvider: DefaultNavigationPresenceProvider
});

export { DefaultNavigation, DefaultNavigationPresenceProvider };
