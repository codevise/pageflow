import styles from './Section.module.css';

export function useBackdropSectionClassNames(backdrop) {
  return [
    styles.section,
    backdrop.file && aspectRatioClassName(backdrop.file),
    backdrop.mobileFile && aspectRatioClassName(backdrop.mobileFile, 'Mobile')
  ].filter(Boolean);
}

function aspectRatioClassName(file, suffix = '') {
  return `aspectRatio${suffix}${Math.round(file.width / file.height * 1000)}`
}
