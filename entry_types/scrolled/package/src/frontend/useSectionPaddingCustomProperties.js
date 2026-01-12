export function useSectionPadding(section, {portrait} = {}) {
  const usePortraitPaddings =
    section.customPortraitPaddings !== false && portrait;

  const paddingTop =
    usePortraitPaddings && section.portraitPaddingTop ?
    section.portraitPaddingTop : section.paddingTop;

  const paddingBottom =
    usePortraitPaddings && section.portraitPaddingBottom ?
    section.portraitPaddingBottom : section.paddingBottom;

  const styles = {};

  if (paddingTop) {
    styles['--foreground-padding-top'] =
      `var(--theme-section-padding-top-${paddingTop})`;
  }

  if (paddingBottom) {
    styles['--foreground-padding-bottom'] =
      `var(--theme-section-padding-bottom-${paddingBottom})`;
  }

  return {styles, paddingTop, paddingBottom};
}
