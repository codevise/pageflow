import {withInlineEditingAlternative} from './inlineEditing';

export const LinkTooltipProvider = withInlineEditingAlternative(
  'LinkTooltipProvider',
  function LinkTooltipProvider({children}) {
    return children;
  }
);
