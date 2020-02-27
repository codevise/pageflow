import React, {useRef, useState, useEffect} from 'react';
import ReactCompareImage from 'react-compare-image';
import styles from './BeforeAfter.module.css';

export function BeforeAfter({state,
                 leftImageLabel,
                 rightImageLabel,
                 startPos = 0,
                 slideMode = 'both',
                }) {
  var [scrollPos, setScrollPos] = useState(
    {
      pos: window.pageYOffset || document.documentElement.scrollTop,
      dir: 'unknown',
    }
  );
  const [isSliding, setIsSliding] = useState(false);
  var [beforeAfterPos, setBeforeAfterPos] = useState(startPos);
  const beforeAfterRef = useRef();
  const slideOnScroll = slideMode === 'both' || slideMode === 'scroll';

  const current = beforeAfterRef.current;

  var [wiggle, setWiggle] = useState(false);
  useEffect(() => {
    var node = current;
    if (node) {
      setWiggle(state === 'active')
    }
  }, [state, current]);

  useEffect(function() {
    var node = current;

    function handler() {
      if (node) {
        setScrollPos(prevPos => {
          const currPos = window.pageYOffset || document.documentElement.scrollTop;
          if (currPos > prevPos['pos']) {
            return {
              pos: currPos,
              dir: 'down',
            };
          }
          if (currPos < prevPos['pos']) {
            return {
              pos: currPos,
              dir: 'up',
            };
          }
          return prevPos;
        });
        if (slideOnScroll) {
          if (scrollPos['dir'] === 'down' && beforeAfterPos < 1) {
            setBeforeAfterPos(prev => prev + 0.025);
            setIsSliding(true);
            setTimeout(() => setIsSliding(false), 200);
          } else if (scrollPos['dir'] === 'up' && beforeAfterPos > 0) {
            setBeforeAfterPos(prev => prev - 0.025);
            setIsSliding(true);
            setTimeout(() => setIsSliding(false), 250);
          } else {
            setIsSliding(false);
          }
        }
      }
    }

    if (!node) {
      return;
    }

    setTimeout(handler, 0);

    if (state === 'active') {
      window.addEventListener('scroll', handler);

      return function() {
        window.removeEventListener('scroll', handler);
      }
    }
  }, [current, setBeforeAfterPos, scrollPos, state, setIsSliding]);

  const awsBucket = '//s3-eu-west-1.amazonaws.com/de.codevise.pageflow.development/pageflow-next/presentation-images/';
  const beforeImage = awsBucket+'before_after/haldern_church1.jpg';
  const afterImage = awsBucket+'before_after/haldern_church2.jpg';

  return (
    <div ref={beforeAfterRef} className={styles.container}>
      <ReactCompareImage leftImage={beforeImage} rightImage={afterImage}
                         sliderPosition={beforeAfterPos} setSliderPosition={setBeforeAfterPos}
                         isSliding={isSliding} setIsSliding={setIsSliding}
                         leftImageLabel={leftImageLabel} rightImageLabel={rightImageLabel}
                         wiggle={wiggle} />
    </div>
  );
};
