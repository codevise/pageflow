import styles from './ContentElementBox.module.css';

export function contentElementBoxProps(configuration, {borderRadius} = {}) {
  return {
    className: styles.properties,
    style: {
      ...(borderRadius && borderRadius !== 'none' && {
        '--content-element-box-border-radius': `var(--theme-content-element-box-border-radius-${borderRadius})`
      }),
      ...(configuration?.boxShadow && {
        '--content-element-box-shadow': `var(--theme-content-element-box-shadow-${configuration.boxShadow})`
      }),
      ...(configuration?.outlineColor && {
        '--content-element-box-outline-color': configuration.outlineColor
      })
    }
  };
}
