import {extensible} from './extensions';

export const LinkTooltipProvider = extensible(
  'LinkTooltipProvider',
  function LinkTooltipProvider({children}) {
    return children;
  }
);
