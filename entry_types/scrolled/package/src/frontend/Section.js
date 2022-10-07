import React, {useRef, useMemo} from 'react';
import classNames from 'classnames';

import { SectionAtmo } from './SectionAtmo';

import {useSectionContentElements} from '../entryState';
import Foreground from './Foreground';
import {Layout} from './layouts';
import useScrollTarget from './useScrollTarget';
import {SectionLifecycleProvider, useSectionLifecycle} from './useSectionLifecycle'
import {withInlineEditingDecorator} from './inlineEditing';
import {BackgroundColorProvider} from './backgroundColor';

import {Backdrop} from './Backdrop';
import {useBackdrop} from './useBackdrop';
import {useBackdropSectionClassNames} from './useBackdropSectionClassNames';
import {useBackdropFileCustomProperties} from './backdropCustomProperties';
import {useMotifAreaState} from './useMotifAreaState';

import styles from './Section.module.css';
import {getTransitionStyles, getEnterAndExitTransitions} from './transitions'
import {getAppearanceComponents} from './appearance';

const Section = withInlineEditingDecorator('SectionDecorator', function Section({
  section, contentElements, state, isScrollTarget, onActivate
}) {
  const backdrop = useBackdrop(section);

  const ref = useRef();
  useScrollTarget(ref, isScrollTarget);

  const transitionStyles = getTransitionStyles(section, section.previousSection, section.nextSection);

  const backdropSectionClassNames = useBackdropSectionClassNames(backdrop, {
    layout: section.layout,
    exposeMotifArea: section.exposeMotifArea,
    empty: !contentElements.length,
  });

  return (
    <section id={`section-${section.permaId}`}
             ref={ref}
             className={classNames(styles.Section,
                                   transitionStyles.section,
                                   backdropSectionClassNames,
                                   {[styles.first]: section.sectionIndex === 0},
                                   {[styles.narrow]: section.width === 'narrow'},
                                   {[styles.invert]: section.invert})}
             style={useBackdropFileCustomProperties(backdrop)}>
      <SectionLifecycleProvider onActivate={onActivate} isLast={!section.nextSection}>
        <SectionAtmo audioFilePermaId={section.atmoAudioFileId} />

        <SectionContents section={section}
                         backdrop={backdrop}
                         contentElements={contentElements}
                         state={state}
                         transitionStyles={transitionStyles} />
      </SectionLifecycleProvider>
    </section>
  );
});

function SectionContents({
  section, backdrop, contentElements, state, transitionStyles
}) {
  const {shouldPrepare} = useSectionLifecycle();

  const sectionProperties = useMemo(() => ({
    layout: section.layout,
    invert: section.invert,
    sectionIndex: section.sectionIndex
  }), [section.layout, section.invert, section.sectionIndex]);

  const [motifAreaState, setMotifAreaRef, setContentAreaRef] = useMotifAreaState({
    updateOnScrollAndResize: shouldPrepare,
    exposeMotifArea: section.exposeMotifArea,
    transitions: getEnterAndExitTransitions(section,
                                            section.previousSection,
                                            section.nextSection),
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
                  minHeight={motifAreaState.minHeight}
                  paddingBottom={!endsWithFullWidthElement(contentElements)}
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
