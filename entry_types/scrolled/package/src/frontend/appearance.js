import NoOpShadow from './shadows/NoOpShadow';
import GradientShadow from './shadows/GradientShadow';

import {InvisibleBoxWrapper} from './foregroundBoxes/InvisibleBoxWrapper';
import GradientBox from './foregroundBoxes/GradientBox';
import CardBox from "./foregroundBoxes/CardBox";
import CardBoxWrapper from "./foregroundBoxes/CardBoxWrapper";

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
  }
};

export function getAppearanceComponents(appearance) {
  return components[appearance || 'shadow']
}
