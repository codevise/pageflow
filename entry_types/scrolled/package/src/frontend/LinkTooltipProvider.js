import {extensible} from './extensionRegistry';

export const LinkTooltipProvider = extensible(
  'LinkTooltipProvider',
  function LinkTooltipProvider({children}) {
    return children;
  }
);
