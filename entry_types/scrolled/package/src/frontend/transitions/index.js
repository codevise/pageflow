import fadeInBgConceal from './fadeInBgConceal.module.css';
import fadeInBgFadeOut from './fadeInBgFadeOut.module.css';
import fadeInBgFadeOutBg from './fadeInBgFadeOutBg.module.css';
import fadeInBgScrollOut from './fadeInBgScrollOut.module.css';

import fadeInConceal from './fadeInConceal.module.css';
import fadeInFadeOut from './fadeInFadeOut.module.css';
import fadeInFadeOutBg from './fadeInFadeOutBg.module.css';
import fadeInScrollOut from './fadeInScrollOut.module.css';

import revealConceal from './revealConceal.module.css';
import revealFadeOut from './revealFadeOut.module.css';
import revealFadeOutBg from './revealFadeOutBg.module.css';
import revealScrollOut from './revealScrollOut.module.css';

import scrollInConceal from './scrollInConceal.module.css';
import scrollInFadeOut from './scrollInFadeOut.module.css';
import scrollInFadeOutBg from './scrollInFadeOutBg.module.css';
import scrollInScrollOut from './scrollInScrollOut.module.css';

const styles = {
  fadeInBgConceal,
  fadeInBgFadeOut,
  fadeInBgFadeOutBg,
  fadeInBgScrollOut,

  fadeInConceal,
  fadeInFadeOut,
  fadeInFadeOutBg,
  fadeInScrollOut,

  revealConceal,
  revealFadeOut,
  revealFadeOutBg,
  revealScrollOut,

  scrollInConceal,
  scrollInFadeOut,
  scrollInFadeOutBg,
  scrollInScrollOut
}

const enterTransitions = {
  fade: 'fadeIn',
  fadeBg: 'fadeInBg',
  scroll: 'scrollIn',
  scrollOver: 'scrollIn',
  reveal: 'reveal',
  beforeAfter: 'reveal'
}

const exitTransitions = {
  fade: 'fadeOut',
  fadeBg: 'fadeOutBg',
  scroll: 'scrollOut',
  scrollOver: 'conceal',
  reveal: 'scrollOut',
  beforeAfter: 'conceal'
}

export function getTransitionNames() {
  return Object.keys(exitTransitions);
}

export function getAvailableTransitionNames(section, previousSection) {
  if (!section.fullHeight || !previousSection.fullHeight) {
    return getTransitionNames().filter(name => !name.startsWith('fade'));
  }

  return getTransitionNames();
}

export function getTransitionStyles(section, previousSection, nextSection) {
  const name = getTransitionStylesName(section, previousSection, nextSection);

  if (!styles[name]) {
    throw new Error(`Unknown transition ${name}`);
  }

  return styles[name];
}

export function getTransitionStylesName(section, previousSection, nextSection) {
  const enterTransition = enterTransitions[getTransitionName(previousSection, section)]
  const exitTransition = exitTransitions[getTransitionName(section, nextSection)]

  return `${enterTransition}${capitalize(exitTransition)}`;
}

function getTransitionName(previousSection, section) {
  if (!section || !previousSection) {
    return 'scroll';
  }

  if ((!section.fullHeight || !previousSection.fullHeight) &&
      section.transition.startsWith('fade')) {
    return 'scroll';
  }

  return section.transition;
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
