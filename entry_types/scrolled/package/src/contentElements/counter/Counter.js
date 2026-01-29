import React, {useState, useCallback, useRef, useEffect} from 'react';
import classNames from 'classnames';
import {
  EditableText,
  Text,
  useContentElementConfigurationUpdate,
  useContentElementEditorState,
  useContentElementLifecycle,
  useI18n,
  useLocale,
  paletteColor,
  contentElementWidths
} from 'pageflow-scrolled/frontend';

import styles from './Counter.module.css';

export function Counter({configuration, contentElementId, contentElementWidth, sectionProps}) {
  const updateConfiguration = useContentElementConfigurationUpdate();
  const locale = useLocale();
  const {t} = useI18n({locale: 'ui'});

  const targetValue = configuration.targetValue || 0;
  const decimalPlaces = configuration.decimalPlaces || 0;
  const startValue = configuration.startValue || 0;
  const countingDuration = countingDurations[configuration.countingSpeed];
  const startAnimationTrigger = configuration.startAnimationTrigger || 'onActivate';

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

    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(intervalRef.current);
    };
  }, [animate, resetAnimation, isEditable]);

  useContentElementLifecycle({
    onActivate: startAnimationTrigger === 'onActivate' ? animate : undefined,
    onVisible: startAnimationTrigger === 'onVisible' ? animate : undefined,

    onInvisible() {
      if (isEditable) {
        resetAnimation();
      }
    }
  });

  function format(value) {
    return value.toLocaleString(locale, {
      useGrouping: !configuration.hideThousandsSeparators,
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    });
  }

  function renderUnit() {
    if (!configuration.unit) {
      return null;
    }

    return (
      <Text scaleCategory="counterUnit"
            typographySize={configuration.unitSize || 'md'}
            inline>
        <span style={configuration.unitColor ? {color: paletteColor(configuration.unitColor)} : undefined}>
          {configuration.unit}
        </span>
      </Text>
    );
  }

  const textAlign = configuration.textAlign ||
    (sectionProps.layout === 'centerRagged' ? 'centerRagged' : 'auto');

  const wrapperAlignment = {
    auto: contentElementWidth > contentElementWidths.md ? 'center' : null,
    center: 'center',
    centerRagged: 'center',
    left: 'left',
    right: 'right'
  }[textAlign];

  const numberAlignment = {
    center: 'numberCenter',
    centerRagged: 'numberCenter',
    right: 'numberRight'
  }[textAlign];

  const descriptionAlignment = {
    centerRagged: 'textCenter',
    right: 'textRight'
  }[textAlign];

  return (
    <div className={styles[wrapperAlignment]}>
      <div className={styles.wrapper}>
        <div
          className={classNames(
            `typography-counter-${configuration.typographyVariant}`,
            styles.number,
            styles[numberAlignment],
            styles[`animation-${configuration.entranceAnimation}`],
            {[styles[`animation-${configuration.entranceAnimation}-active`]]: animated
          })}
          style={{'--counting-duration': `${countingDuration || 1000}ms`}}
        >
          <Text scaleCategory="counterNumber"
                typographySize={configuration.numberSize || legacyTextSizes[configuration.textSize] || 'md'}
                inline>
            <span style={{color: paletteColor(configuration.numberColor)}}>
              {configuration.unitPlacement === 'leading' && renderUnit()}
              {format(currentValue)}
              {configuration.unitPlacement !== 'leading' && renderUnit()}
            </span>
          </Text>
        </div>
        <div className={styles[descriptionAlignment]}
             style={{color: paletteColor(configuration.descriptionColor)}}>
          <EditableText value={configuration.description}
                        contentElementId={contentElementId}
                        className={styles.description}
                        onChange={description => updateConfiguration({description})}
                        onlyParagraphs={true}
                        scaleCategory="counterDescription"
                        typographySize={configuration.descriptionSize || 'md'}
                        placeholder={t('pageflow_scrolled.inline_editing.type_description')} />
        </div>
      </div>
    </div>
  );
}

const countingDurations = {
  none: 0,
  fast: 500,
  medium: 2000,
  slow: 5000
}

const legacyTextSizes = {
  verySmall: 'xs',
  small: 'md',
  medium: 'xl',
  large: 'xxxl'
};

function easeInOut(t) {
  t = t * 2;
  if (t < 1) return (t**2)/2;
  t = t - 1;
  return t - (t**2)/2 + 1/2;
};

function easeOut(t) {
  return (t - (t**2)/2) * 2;
};
