import React, {useMemo} from 'react';
import classNames from 'classnames';

import { SectionAtmo } from './SectionAtmo';

import {
  useSectionForegroundContentElements,
  useFileWithInlineRights
} from 'pageflow-scrolled/entryState';

import {Foreground} from './Foreground';
import {BackdropFrameEffect} from './BackdropFrameEffect';
import {SectionInlineFileRights} from './SectionInlineFileRights';
import {Layout, widths as contentElementWidths} from './layouts';
import {useScrollTarget} from './useScrollTarget';
import {usePhoneLayout} from './usePhoneLayout';
import {SectionLifecycleProvider, useSectionLifecycle} from './useSectionLifecycle'
import {SectionViewTimelineProvider} from './SectionViewTimelineProvider';
import {extensible} from './extensions';
import {BackgroundColorProvider} from './backgroundColor';
import {SelectableWidget} from './SelectableWidget';
import {useSectionPadding} from './useSectionPaddingCustomProperties';
import {SectionIntersectionProbe} from './SectionIntersectionObserver';
import {getAppearanceComponents, getAppearanceSectionScopeName, useAppearanceOverlayStyle} from './appearance';

import {Backdrop} from './Backdrop';
import {useMotifAreaState} from './useMotifAreaState';
import {useBackdrop} from './useBackdrop';

import styles from './Section.module.css';
import {getTransitionStyles, getEnterAndExitTransitions} from './transitions'

const Section = extensible('Section', function Section({
  section, transitions, backdrop, contentElements, state, onActivate, domIdPrefix
}) {
  const ref = useScrollTarget(section.id);

  const sectionOverlayStyle = useAppearanceOverlayStyle(section);
  const transitionStyles = getTransitionStyles(section, sectionOverlayStyle);

  const atmoAudioFile = useFileWithInlineRights({
    configuration: section,
    collectionName: 'audioFiles',
    propertyName: 'atmoAudioFileId'
  });

  const sectionPadding = useSectionPadding(section, {portrait: backdrop.portrait});

  return (
    <section id={`${domIdPrefix}-${section.permaId}`}
             ref={ref}
             className={classNames(styles.Section,
                                   transitionStyles.section,
                                   {[styles.first]: section.sectionIndex === 0 && !section.chapter?.isExcursion},
                                   {[styles.narrow]: section.width === 'narrow'},
                                   `scope-${getAppearanceSectionScopeName(section.appearance)}`,
                                   section.invert ? styles.darkContent : styles.lightContent)}
             style={sectionPadding.styles}>
      <SectionLifecycleProvider onActivate={onActivate}
                                entersWithFadeTransition={section.transition?.startsWith('fade')}>
        <SectionIntersectionProbe section={section} />
        <SectionViewTimelineProvider backdrop={backdrop}>
          <BackgroundColorProvider dark={!section.invert}>
            <SectionAtmo audioFile={atmoAudioFile} />

            <SectionContents section={section}
                             transitions={transitions}
                             backdrop={backdrop}
                             contentElements={contentElements}
                             state={state}
                             transitionStyles={transitionStyles}
                             sectionOverlayStyle={sectionOverlayStyle}
                             sectionPadding={sectionPadding} />

            <SectionInlineFileRights section={section}
                                     backdrop={backdrop}
                                     atmoAudioFile={atmoAudioFile}
                                     state={state} />

            {section.sectionIndex === 0 &&
             <SelectableWidget role="scrollIndicator"
                               props={{sectionLayout: section.layout}} />}
          </BackgroundColorProvider>
        </SectionViewTimelineProvider>
      </SectionLifecycleProvider>
    </section>
  );
});

Section.defaultProps = {
  domIdPrefix: 'section'
};

function SectionContents({
  section, backdrop, contentElements, state, transitions, transitionStyles, sectionOverlayStyle, sectionPadding
}) {
  const {shouldPrepare} = useSectionLifecycle();

  const [, exitTransition] = transitions;

  const [motifAreaState, setMotifAreaRef, setContentAreaRef] = useMotifAreaState({
    backdropContentElement: 'contentElement' in backdrop,
    updateOnScrollAndResize: shouldPrepare,
    exposeMotifArea: section.exposeMotifArea,
    transitions,
    empty: !contentElements.length,
    fullHeight: section.fullHeight
  });

  const sectionProperties = useMemo(() => ({
    layout: section.layout,
    invert: section.invert,
    sectionIndex: section.sectionIndex,
    constrainContentWidth: section.appearance === 'split' &&
                           !motifAreaState.isContentPadded
  }), [section.layout, section.invert, section.sectionIndex,
       section.appearance, motifAreaState.isContentPadded]);

  const {Shadow, Box, BoxWrapper} = getAppearanceComponents(section.appearance)

  const staticShadowOpacity = percentToFraction(section.staticShadowOpacity, {defaultValue: 0.7});
  const dynamicShadowOpacity = percentToFraction(section.dynamicShadowOpacity, {defaultValue: 0.7});

  return (
    <>
      <Backdrop backdrop={backdrop}
                eagerLoad={section.sectionIndex === 0}
                size={section.backdropSize}

                motifAreaState={motifAreaState}
                onMotifAreaUpdate={setMotifAreaRef}

                state={state}
                transitionStyles={transitionStyles}>
        {(children) =>
          <Shadow align={section.layout}
                  inverted={section.invert}
                  motifAreaState={motifAreaState}
                  staticShadowOpacity={staticShadowOpacity}
                  dynamicShadowOpacity={dynamicShadowOpacity}
                  overlayStyle={sectionOverlayStyle}>
            {children}
          </Shadow>}
      </Backdrop>
      <BackdropFrameEffect backdrop={backdrop} />
      <Foreground section={section}
                  transitionStyles={transitionStyles}
                  state={state}
                  motifAreaState={motifAreaState}
                  sectionPadding={sectionPadding}
                  minHeight={motifAreaState.minHeight}
                  suppressedPaddings={getSuppressedPaddings(contentElements, motifAreaState)}
                  heightMode={heightMode(section)}>
        <Box inverted={section.invert}
             coverInvisibleNextSection={exitTransition.startsWith('fade')}
             transitionStyles={transitionStyles}
             state={state}
             motifAreaState={motifAreaState}
             staticShadowOpacity={staticShadowOpacity}
             overlayStyle={sectionOverlayStyle}>
          <Layout sectionId={section.id}
                  items={contentElements}
                  appearance={section.appearance}
                  constrainContentWidth={sectionProperties.constrainContentWidth}
                  contentAreaRef={setContentAreaRef}
                  sectionProps={sectionProperties}
                  isContentPadded={motifAreaState.isContentPadded}>
            {(children, boxProps) =>
              <BoxWrapper {...boxProps}
                          transitionStyles={transitionStyles}
                          overlayStyle={sectionOverlayStyle}
                          inverted={section.invert}>
                {children}
              </BoxWrapper>}
          </Layout>
        </Box>
      </Foreground>
    </>
  );
}

function ConnectedSection(props) {
  const contentElements = useSectionForegroundContentElements({
    sectionId: props.section.id,
    layout: props.section.layout,
    phoneLayout: usePhoneLayout()
  });

  const backdrop = useBackdrop(props.section);

  const transitions = getEnterAndExitTransitions(props.section);

  return <Section {...props}
                  transitions={transitions}
                  backdrop={backdrop}
                  contentElements={contentElements} />
}

export { ConnectedSection as Section };

function heightMode(section) {
  if (section.fullHeight) {
    if ((section.transition.startsWith('fade') && section.previousSection) ||
        (section.nextSection && section.nextSection.transition.startsWith('fade'))) {
      return 'fullFade';
    }
    else {
      return 'full';
    }
  }

  return 'dynamic';
}

function getSuppressedPaddings(contentElements, motifAreaState) {
  return {
    top: isFullWidthElement(contentElements[0]) || motifAreaState.isContentPadded,
    bottom: isFullWidthElement(contentElements[contentElements.length - 1])
  };
}

function isFullWidthElement(element) {
  return element &&
         element.position === 'inline' &&
         element.width === contentElementWidths.full;
}

function percentToFraction(value, {defaultValue}) {
  return typeof value !== 'undefined' ? value / 100 : defaultValue;
}
