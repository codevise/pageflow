import React, {useState, useCallback, useRef, useEffect} from 'react';
import classNames from 'classnames';
import {
  EditableText,
  Text,
  useContentElementConfigurationUpdate,
  useContentElementEditorState,
  useContentElementLifecycle,
  useI18n,
  useLocale
} from 'pageflow-scrolled/frontend';

import styles from './Counter.module.css';

export function Counter({configuration, contentElementId, sectionProps}) {
  const updateConfiguration = useContentElementConfigurationUpdate();
  const locale = useLocale();
  const {t} = useI18n({locale: 'ui'});

  const targetValue = configuration.targetValue;
  const decimalPlaces = configuration.decimalPlaces || 0;
  const startValue = configuration.startValue || 0;
  const countingDuration = countingDurations[configuration.countingSpeed];

  const [currentValue, setCurrentValue] = useState(
    countingDuration > 0 ? startValue : targetValue
  );
  const [animated, setAnimated] = useState(false);

  const intervalRef = useRef();
  const timeoutRef = useRef();

  const {isEditable} = useContentElementEditorState();

  const animate = useCallback(() => {
    setAnimated(true);

    if (!intervalRef.current && countingDuration > 0) {
      const startTime = new Date().getTime();
      const ease =
        configuration.entranceAnimation && configuration.entranceAnimation !== 'none' ?
        easeOut : easeInOut;

      intervalRef.current = setInterval(() => {
        const t = (new Date().getTime() - startTime) / countingDuration;

        if (t < 1) {
          setCurrentValue(startValue + (targetValue - startValue) * ease(t));
        }
        else {
          clearInterval(intervalRef.current);
          setCurrentValue(targetValue);
        }
      }, 10);
    }
  }, [targetValue, startValue, countingDuration, configuration.entranceAnimation]);

  const resetAnimation = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;

    setCurrentValue(countingDuration > 0 ? startValue : targetValue);
    setAnimated(false);
  }, [startValue, targetValue, countingDuration]);

  useEffect(() => {
    if (isEditable) {
      resetAnimation()

      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(animate, 500);
    }
  }, [animate, resetAnimation, isEditable]);

  useContentElementLifecycle({
    onActivate() {
      animate();
    },

    onInvisible() {
      if (isEditable) {
        resetAnimation();
      }
    }
  });

  function format(value) {
    const localeString = value.toLocaleString(locale, {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    });

    const unit = configuration.unit || '';

    return configuration.unitPlacement === 'leading' ?
           `${unit}${localeString}` :
           `${localeString}${unit}`;
  }

  return (
    <div className={classNames(
      {[styles.wide]: configuration.position === 'wide'}
    )}>
      <div className={classNames(
        styles.wrapper,
        {[styles.centerRagged]: sectionProps.layout === 'centerRagged'}
      )}>
        <Text scaleCategory={numberScaleCategories[configuration.textSize || 'medium']}>
          <div
            className={classNames(
              `typography-counter-${configuration.typographyVariant}`,
              styles.number,
              styles[`animation-${configuration.entranceAnimation}`],
              {[styles[`animation-${configuration.entranceAnimation}-active`]]: animated
            })}
            style={{'--counting-duration': `${countingDuration || 1000}ms`}}
          >
            {format(currentValue)}
          </div>
        </Text>
        <EditableText value={configuration.description}
                      contentElementId={contentElementId}
                      className={styles.description}
                      onChange={description => updateConfiguration({description})}
                      onlyParagraphs={true}
                      scaleCategory="counterDescription"
                      placeholder={t('pageflow_scrolled.inline_editing.type_description')} />
      </div>
    </div>
  );
}

const numberScaleCategories = {
  small: 'counterNumber-sm',
  medium: 'counterNumber-md',
  large: 'counterNumber-lg'
};

const countingDurations = {
  none: 0,
  fast: 500,
  medium: 2000,
  slow: 5000
}

function easeInOut(t) {
  t = t * 2;
  if (t < 1) return (t**2)/2;
  t = t - 1;
  return t - (t**2)/2 + 1/2;
};

function easeOut(t) {
  return (t - (t**2)/2) * 2;
};
