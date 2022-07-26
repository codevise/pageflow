import React, {useRef, useMemo} from 'react';
import classNames from 'classnames';

import { SectionAtmo } from './SectionAtmo';

import {useSectionContentElements} from '../entryState';
import {Backdrop} from './Backdrop';
import Foreground from './Foreground';
import {Layout} from './layouts';
import {useMotifAreaState} from './useMotifAreaState';
import useScrollTarget from './useScrollTarget';
import {SectionLifecycleProvider, useSectionLifecycle} from './useSectionLifecycle'
import {withInlineEditingDecorator} from './inlineEditing';
import {BackgroundColorProvider} from './backgroundColor';

import styles from './Section.module.css';
import {getTransitionStyles, getEnterAndExitTransitions} from './transitions'
import {getAppearanceComponents} from './appearance';

const Section = withInlineEditingDecorator('SectionDecorator', function Section({
  section, contentElements, state, isScrollTarget, onActivate
}) {
  const ref = useRef();
  useScrollTarget(ref, isScrollTarget);

  const transitionStyles = getTransitionStyles(section, section.previousSection, section.nextSection);

  return (
    <section id={`section-${section.permaId}`}
             ref={ref}
             className={classNames(styles.Section,
                                   transitionStyles.section,
                                   {[styles.narrow]: section.width === 'narrow'},
                                   {[styles.invert]: section.invert})}>
      <SectionLifecycleProvider onActivate={onActivate} isLast={!section.nextSection}>
        <SectionAtmo audioFilePermaId={section.atmoAudioFileId} />

        <SectionContents section={section}
                         contentElements={contentElements}
                         state={state}
                         transitionStyles={transitionStyles} />
      </SectionLifecycleProvider>
    </section>
  );
});

function SectionContents({
  section, contentElements, state, transitionStyles
}) {
  const {shouldPrepare} = useSectionLifecycle();

  const sectionProperties = useMemo(() => ({
    layout: section.layout,
    invert: section.invert,
    sectionIndex: section.sectionIndex
  }), [section.layout, section.invert, section.sectionIndex]);

  const [motifAreaState, setMotifAreaRef, setContentAreaRef, setForegroundContentRef] = useMotifAreaState({
    updateOnScrollAndResize: shouldPrepare,
    exposeMotifArea: section.exposeMotifArea,
    transitions: getEnterAndExitTransitions(section, section.previousSection, section.nextSection),
    empty: !contentElements.length,
    sectionTransition: section.transition,
    fullHeight: section.fullHeight
  });

  const {Shadow, Box, BoxWrapper} = getAppearanceComponents(section.appearance)

  const staticShadowOpacity = percentToFraction(section.staticShadowOpacity, {defaultValue: 0.7});
  const dynamicShadowOpacity = percentToFraction(section.dynamicShadowOpacity, {defaultValue: 0.7});

  return (
    <>
      <Backdrop {...section.backdrop}
                effects={section.backdropEffects}
                effectsMobile={section.backdropEffectsMobile}
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

      <Foreground transitionStyles={transitionStyles}
                  state={state}
                  inFirstSection={section.sectionIndex === 0}
                  minHeight={motifAreaState.minHeight}
                  paddingBottom={!endsWithFullWidthElement(contentElements)}
                  contentRef={setForegroundContentRef}
                  heightMode={heightMode(section)}>
        <Box inverted={section.invert}
             coverInvisibleNextSection={section.nextSection && section.nextSection.transition.startsWith('fade')}
             transitionStyles={transitionStyles}
             state={state}
             motifAreaState={motifAreaState}
             staticShadowOpacity={staticShadowOpacity}>
          <BackgroundColorProvider dark={!section.invert}>
            <Layout sectionId={section.id}
                    items={contentElements}
                    appearance={section.appearance}
                    contentAreaRef={setContentAreaRef}
                    sectionProps={sectionProperties}>
              {(children, boxProps) => <BoxWrapper {...boxProps} inverted={section.invert}>{children}</BoxWrapper>}
            </Layout>
          </BackgroundColorProvider>
        </Box>
      </Foreground>
    </>
  );
}

function ConnectedSection(props) {
  const contentElements = useSectionContentElements({sectionId: props.section.id});

  return <Section {...props} contentElements={contentElements} />
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
  return lastElement && lastElement.position === 'full';
}

function percentToFraction(value, {defaultValue}) {
  return typeof value !== 'undefined' ? value / 100 : defaultValue;
}
