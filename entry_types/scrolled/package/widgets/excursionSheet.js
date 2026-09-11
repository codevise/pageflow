import { useI18n, ThemeIcon, useIsomorphicLayoutEffect, SectionIntersectionObserver, useOnScreen, frontend } from 'pageflow-scrolled/frontend';
import React, { useRef, useEffect, useState } from 'react';
import classNames from 'classnames';

var styles = {"button":"CloseButton-module_button__3aQ6f","invert":"CloseButton-module_invert__3C788"};

function CloseButton({
  invert,
  onClick
}) {
  const {
    t
  } = useI18n();
  return /*#__PURE__*/React.createElement("button", {
    className: classNames(styles.button, {
      [styles.invert]: invert
    }),
    "aria-label": t('pageflow_scrolled.public.close'),
    title: t('pageflow_scrolled.public.close'),
    onClick: onClick
  }, /*#__PURE__*/React.createElement(ThemeIcon, {
    name: "close",
    width: 30,
    height: 30
  }));
}

function useScrollCenter() {
  const parentRef = useRef();
  const childRef = useRef();
  useEffect(() => {
    function onScroll() {
      const parentRect = parentRef.current.getBoundingClientRect();
      childRef.current.style.transform = `translate(-50%, calc((100lvh - ${parentRect.top}px) * 0.3 - 50%)`;
    }
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  return [parentRef, childRef];
}

var styles$1 = {"wrapper":"ReturnButton-module_wrapper__3rzAj","button":"ReturnButton-module_button__1SKjN"};

function ReturnButton({
  label,
  onClose,
  children
}) {
  const [wrapperRef, buttonRef] = useScrollCenter();
  useIsomorphicLayoutEffect(() => {
    const timeline = new window.ViewTimeline({
      subject: wrapperRef.current
    });
    const animation = buttonRef.current.animate({
      opacity: ['0', '1']
    }, {
      timeline,
      fill: 'both',
      rangeStart: 'entry 10%',
      rangeEnd: 'entry 50%'
    });
    return () => animation.cancel();
  }, []);
  const {
    t
  } = useI18n();
  return /*#__PURE__*/React.createElement("div", {
    className: styles$1.wrapper,
    ref: wrapperRef,
    onClick: onClose
  }, /*#__PURE__*/React.createElement("button", {
    className: styles$1.button,
    ref: buttonRef
  }, /*#__PURE__*/React.createElement(ThemeIcon, {
    name: "back",
    width: 30,
    height: 30
  }), label || t('pageflow_scrolled.public.exit_excursion')));
}

var styles$2 = {"container":"ExcursionSheet-module_container__2NpY_ colors-module_contentColorScope__1Oidv","width-inset":"ExcursionSheet-module_width-inset__2uSgb","backdrop":"ExcursionSheet-module_backdrop__3RyMJ","content":"ExcursionSheet-module_content__3pYqz","clip":"ExcursionSheet-module_clip__2y2Bg","probe":"ExcursionSheet-module_probe__3xetc"};

function ExcursionSheet({
  excursion,
  onClose,
  setIsCoveringBackground,
  children
}) {
  const contentRef = useRef();
  const [intersectingSectionInverted, setIntersectingSectionInverted] = useState(false);
  useCoversScreen(contentRef, setIsCoveringBackground);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: styles$2.backdrop,
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    key: excursion.id,
    className: classNames(styles$2.container, styles$2[`width-${excursion.sheetWidth}`])
  }, /*#__PURE__*/React.createElement(CloseButton, {
    invert: intersectingSectionInverted,
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    ref: contentRef,
    className: styles$2.content
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$2.clip
  }, /*#__PURE__*/React.createElement(SectionIntersectionObserver, {
    sections: excursion.sections,
    probeClassName: styles$2.probe,
    onChange: section => setIntersectingSectionInverted(section === null || section === void 0 ? void 0 : section.invert)
  }, children))), /*#__PURE__*/React.createElement(ReturnButton, {
    label: excursion.returnButtonLabel,
    onClose: onClose
  })));
}
function useCoversScreen(ref, onChange) {
  const intersectsTopRef = useRef(false);
  const intersectsBottomRef = useRef(false);
  const updateCoverage = () => {
    const isCovering = intersectsTopRef.current && intersectsBottomRef.current;
    onChange(isCovering);
  };
  const handleTopEdgeIntersection = intersecting => {
    intersectsTopRef.current = intersecting;
    updateCoverage();
  };
  const handleBottomEdgeIntersection = intersecting => {
    intersectsBottomRef.current = intersecting;
    updateCoverage();
  };
  useOnScreen(ref, {
    rootMargin: '0px 0px -100% 0px',
    onChange: handleTopEdgeIntersection
  });
  useOnScreen(ref, {
    rootMargin: '-100% 0px 0px 0px',
    onChange: handleBottomEdgeIntersection
  });
  useEffect(() => {
    return () => onChange(false);
  }, [onChange]);
}

frontend.widgetTypes.register('excursionSheet', {
  component: ExcursionSheet
});
