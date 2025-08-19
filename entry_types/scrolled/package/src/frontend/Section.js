import React, {useMemo} from 'react';
import classNames from 'classnames';

import { SectionAtmo } from './SectionAtmo';

import {
  useSectionForegroundContentElements,
  useAdditionalSeedData,
  useFileWithInlineRights
} from '../entryState';

import Foreground from './Foreground';
import {BackdropFrameEffect} from './BackdropFrameEffect';
import {SectionInlineFileRights} from './SectionInlineFileRights';
import {Layout, widths as contentElementWidths} from './layouts';
import {useScrollTarget} from './useScrollTarget';
import {usePhoneLayout} from './usePhoneLayout';
import {SectionLifecycleProvider, useSectionLifecycle} from './useSectionLifecycle'
import {SectionViewTimelineProvider} from './SectionViewTimelineProvider';
import {withInlineEditingDecorator} from './inlineEditing';
import {BackgroundColorProvider} from './backgroundColor';
import {SelectableWidget} from './SelectableWidget';
import {useSectionPaddingCustomProperties} from './useSectionPaddingCustomProperties';
import {SectionIntersectionProbe} from './SectionIntersectionObserver';

import * as v1 from './v1';
import * as v2 from './v2';

import styles from './Section.module.css';
import {getTransitionStyles, getEnterAndExitTransitions} from './transitions'
import {getAppearanceComponents} from './appearance';

const Section = withInlineEditingDecorator('SectionDecorator', function Section({
  section, transitions, backdrop, contentElements, state, onActivate, domIdPrefix
}) {
  const {
    useBackdropSectionClassNames,
    useBackdropSectionCustomProperties
  } = (useAdditionalSeedData('frontendVersion') === 2 ? v2 : v1);

  const ref = useScrollTarget(section.id);

  const transitionStyles = getTransitionStyles(section, section.previousSection, section.nextSection);

  const backdropSectionClassNames = useBackdropSectionClassNames(backdrop, {
    layout: section.layout,
    exposeMotifArea: section.exposeMotifArea,
    empty: !contentElements.length,
  });

  const atmoAudioFile = useFileWithInlineRights({
    configuration: section,
    collectionName: 'audioFiles',
    propertyName: 'atmoAudioFileId'
  });

  return (
    <section id={`${domIdPrefix}-${section.permaId}`}
             ref={ref}
             className={classNames(styles.Section,
                                   transitionStyles.section,
                                   backdropSectionClassNames,
                                   {[styles.first]: section.sectionIndex === 0},
                                   {[styles.narrow]: section.width === 'narrow'},
                                   section.invert ? styles.darkContent : styles.lightContent)}
             style={{
               ...useBackdropSectionCustomProperties(backdrop),
               ...useSectionPaddingCustomProperties(section)
             }}>
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
                             transitionStyles={transitionStyles} />

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
  section, backdrop, contentElements, state, transitions, transitionStyles
}) {
  const {
    Backdrop,
    useMotifAreaState
  } = (useAdditionalSeedData('frontendVersion') === 2 ? v2 : v1);

  const {shouldPrepare} = useSectionLifecycle();

  const sectionProperties = useMemo(() => ({
    layout: section.layout,
    invert: section.invert,
    sectionIndex: section.sectionIndex
  }), [section.layout, section.invert, section.sectionIndex]);

  const [, exitTransition] = transitions;

  const [motifAreaState, setMotifAreaRef, setContentAreaRef] = useMotifAreaState({
    backdropContentElement: 'contentElement' in backdrop,
    updateOnScrollAndResize: shouldPrepare,
    exposeMotifArea: section.exposeMotifArea,
    transitions,
    empty: !contentElements.length,
    fullHeight: section.fullHeight
  });

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
                  dynamicShadowOpacity={dynamicShadowOpacity}>
            {children}
          </Shadow>}
      </Backdrop>
      <BackdropFrameEffect backdrop={backdrop} />
      <Foreground transitionStyles={transitionStyles}
                  state={state}
                  minHeight={motifAreaState.minHeight}
                  paddingBottom={!endsWithFullWidthElement(contentElements)}
                  heightMode={heightMode(section)}>
        <Box inverted={section.invert}
             coverInvisibleNextSection={exitTransition.startsWith('fade')}
             transitionStyles={transitionStyles}
             state={state}
             motifAreaState={motifAreaState}
             staticShadowOpacity={staticShadowOpacity}>
          <Layout sectionId={section.id}
                  items={contentElements}
                  appearance={section.appearance}
                  contentAreaRef={setContentAreaRef}
                  sectionProps={sectionProperties}>
            {(children, boxProps) =>
              <BoxWrapper {...boxProps}
                          cardSurfaceColor={section.cardSurfaceColor}
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

  const {
    useBackdrop,
  } = (useAdditionalSeedData('frontendVersion') === 2 ? v2 : v1);

  const backdrop = useBackdrop(props.section);

  const transitions = getEnterAndExitTransitions(
    props.section,
    props.section.previousSection,
    props.section.nextSection
  );

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

function endsWithFullWidthElement(elements) {
  const lastElement = elements[elements.length - 1];
  return lastElement &&
         lastElement.position === 'inline' &&
         lastElement.width === contentElementWidths.full;
}

function percentToFraction(value, {defaultValue}) {
  return typeof value !== 'undefined' ? value / 100 : defaultValue;
}
