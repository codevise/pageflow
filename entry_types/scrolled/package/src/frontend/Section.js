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

const Section = withInlineEditingDecorator('SectionDecorator', function Section(props) {
  const ref = useRef();
  useScrollTarget(ref, props.isScrollTarget);

  const transitionStyles = getTransitionStyles(props, props.previousSection, props.nextSection);

  return (
    <section id={`section-${props.permaId}`}
             ref={ref}
             className={classNames(styles.Section,
                                   transitionStyles.section,
                                   {[styles.invert]: props.invert})}>
      <SectionLifecycleProvider onActivate={props.onActivate} isLast={!props.nextSection}>
        <SectionAtmo audioFilePermaId={props.atmoAudioFileId} />

        <SectionContents {...props} transitionStyles={transitionStyles} />
      </SectionLifecycleProvider>
    </section>
  );
});

function SectionContents(props) {
  const {shouldPrepare} = useSectionLifecycle();

  const sectionProperties = useMemo(() => ({
    layout: props.layout,
    invert: props.invert,
    sectionIndex: props.sectionIndex
  }), [props.layout, props.invert, props.sectionIndex]);

  const [motifAreaState, setMotifAreaRef, setContentAreaRef, setForegroundContentRef] = useMotifAreaState({
    isActive: shouldPrepare,
    transitions: getEnterAndExitTransitions(props, props.previousSection, props.nextSection),
    empty: !props.contentElements.length,
    sectionTransition: props.transition,
    fullHeight: props.fullHeight
  });

  const {Shadow, Box, BoxWrapper} = getAppearanceComponents(props.appearance)

  return (
    <>
      <Backdrop {...props.backdrop}
                onMotifAreaUpdate={setMotifAreaRef}
                state={props.state}
                transitionStyles={props.transitionStyles}>
        {(children) =>
          <Shadow align={props.layout}
                  inverted={props.invert}
                  motifAreaState={motifAreaState}
                  opacity={props.shadowOpacity >= 0 ? props.shadowOpacity / 100 : 0.7}>
            {children}
          </Shadow>}
      </Backdrop>

      <Foreground transitionStyles={props.transitionStyles}
                  state={props.state}
                  minHeight={motifAreaState.minHeight}
                  paddingBottom={!endsWithFullWidthElement(props.contentElements)}
                  contentRef={setForegroundContentRef}
                  heightMode={heightMode(props)}>
        <Box inverted={props.invert}
             coverInvisibleNextSection={props.nextSection && props.nextSection.transition.startsWith('fade')}
             transitionStyles={props.transitionStyles}
             state={props.state}
             motifAreaState={motifAreaState}
             opacity={props.shadowOpacity}>
          <BackgroundColorProvider dark={!props.invert}>
            <Layout sectionId={props.id}
                    items={props.contentElements}
                    appearance={props.appearance}
                    contentAreaRef={setContentAreaRef}
                    sectionProps={sectionProperties}>
              {(children, boxProps) => <BoxWrapper {...boxProps} inverted={props.invert}>{children}</BoxWrapper>}
            </Layout>
          </BackgroundColorProvider>
        </Box>
      </Foreground>
    </>
  );
}

function ConnectedSection(props) {
  const contentElements = useSectionContentElements({sectionId: props.id});

  return <Section {...props} contentElements={contentElements} />
}

export { ConnectedSection as Section };

function heightMode(props) {
  if (props.fullHeight) {
    if (props.transition.startsWith('fade') ||
        (props.nextSection && props.nextSection.transition.startsWith('fade'))) {
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
