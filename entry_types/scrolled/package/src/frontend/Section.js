import React, {useRef, useMemo} from 'react';
import classNames from 'classnames';

import { SectionAtmo } from './SectionAtmo';

import {Backdrop} from './Backdrop';
import Foreground from './Foreground';
import {Layout} from './layouts';
import {useMotifAreaState} from './useMotifAreaState';
import useScrollTarget from './useScrollTarget';
import {SectionLifecycleProvider} from './useSectionLifecycle'
import {withInlineEditingDecorator} from './inlineEditing';
import {BackgroundColorProvider} from './backgroundColor';

import styles from './Section.module.css';
import {getTransitionStyles, getEnterAndExitTransitions} from './transitions'
import {getAppearanceComponents} from './appearance';

export const OnScreenContext = React.createContext({
  center: false,
  top: false,
  bottom: false
});

export default withInlineEditingDecorator('SectionDecorator', function Section(props) {
  const ref = useRef();
  useScrollTarget(ref, props.isScrollTarget);

  const sectionProperties = useMemo(() => ({
    layout: props.layout,
    invert: props.invert,
    sectionIndex: props.sectionIndex
  }), [props.layout, props.invert, props.sectionIndex]);

  const [motifAreaState, setMotifAreaRef, setContentAreaRef, setForegroundContentRef] = useMotifAreaState({
    transitions: getEnterAndExitTransitions(props, props.previousSection, props.nextSection),
    empty: !props.foreground.length,
    sectionTransition: props.transition,
    fullHeight: props.fullHeight
  });

  const transitionStyles = getTransitionStyles(props, props.previousSection, props.nextSection);
  const {Shadow, Box, BoxWrapper} = getAppearanceComponents(props.appearance)

  return (
    <section id={`section-${props.permaId}`}
             ref={ref}
             className={classNames(styles.Section,
                                   transitionStyles.section,
                                   {[styles.invert]: props.invert})}>
      <SectionLifecycleProvider onActivate={props.onActivate} isLast={!props.nextSection}>
        <SectionAtmo audioFilePermaId={props.atmoAudioFileId} />

        <Backdrop {...props.backdrop}
                  onMotifAreaUpdate={setMotifAreaRef}
                  state={props.state}
                  transitionStyles={transitionStyles}>
          {(children) =>
            <Shadow align={props.layout}
                    inverted={props.invert}
                    motifAreaState={motifAreaState}
                    opacity={props.shadowOpacity >= 0 ? props.shadowOpacity / 100 : 0.7}>
              {children}
            </Shadow>}
        </Backdrop>

        <Foreground transitionStyles={transitionStyles}
                    state={props.state}
                    minHeight={motifAreaState.minHeight}
                    paddingBottom={!endsWithFullWidthElement(props.foreground)}
                    contentRef={setForegroundContentRef}
                    heightMode={heightMode(props)}>
          <Box inverted={props.invert}
               coverInvisibleNextSection={props.nextSection && props.nextSection.transition.startsWith('fade')}
               transitionStyles={transitionStyles}
               state={props.state}
               motifAreaState={motifAreaState}
               opacity={props.shadowOpacity}>
            <BackgroundColorProvider dark={!props.invert}>
              <Layout sectionId={props.id}
                      items={indexItems(props.foreground)}
                      appearance={props.appearance}
                      contentAreaRef={setContentAreaRef}
                      sectionProps={sectionProperties}>
                {(children, boxProps) => <BoxWrapper {...boxProps} inverted={props.invert}>{children}</BoxWrapper>}
              </Layout>
            </BackgroundColorProvider>
          </Box>
        </Foreground>
      </SectionLifecycleProvider>
    </section>
  );
});

function indexItems(items) {
  return items.map((item, index) =>
    ({...item, index})
  );
}

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
