import NoOpShadow from './shadows/NoOpShadow';
import GradientShadow from './shadows/GradientShadow';
import SplitShadow from './shadows/SplitShadow';

import {InvisibleBoxWrapper} from './foregroundBoxes/InvisibleBoxWrapper';
import GradientBox from './foregroundBoxes/GradientBox';
import CardBox from "./foregroundBoxes/CardBox";
import CardBoxWrapper from "./foregroundBoxes/CardBoxWrapper";
import SplitBox from "./foregroundBoxes/SplitBox";

const components = {
  shadow: {
    Shadow: GradientShadow,
    Box: GradientBox,
    BoxWrapper: InvisibleBoxWrapper
  },
  transparent: {
    Shadow: NoOpShadow,
    Box: CardBox,
    BoxWrapper: InvisibleBoxWrapper
  },
  cards: {
    Shadow: NoOpShadow,
    Box: CardBox,
    BoxWrapper: CardBoxWrapper
  },
  split: {
    Shadow: SplitShadow,
    Box: SplitBox,
    BoxWrapper: InvisibleBoxWrapper
  }
};

const sectionScopeNames = {
  shadow: 'shadowAppearanceSection',
  transparent: 'transparentAppearanceSection',
  cards: 'cardsAppearanceSection',
  split: 'splitAppearanceSection'
};

export function getAppearanceComponents(appearance) {
  return components[appearance || 'shadow']
}

export function getAppearanceSectionScopeName(appearance) {
  return sectionScopeNames[appearance || 'shadow'];
}
