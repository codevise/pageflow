import '../frontend';
import {storiesOfContentElement} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'soundDisclaimer',
  baseConfiguration: {},
  variants: [
    {
      name: 'With custom texts',
      configuration: {
        mutedText: 'Unmute now for the best experience.',
        unmutedText: 'Unmuted! Have fun!',
      }
    }
  ]
});
