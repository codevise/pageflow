import {useTransitionStyles} from '@floating-ui/react';

export function useTooltipTransitionStyles(context) {
  return useTransitionStyles(context, {duration: 0});
};
