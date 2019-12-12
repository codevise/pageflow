import Heading from './Heading';
import TextBlock from './TextBlock';
import InlineImage from './InlineImage';
import InlineVideo from './InlineVideo';
import InlineBeforeAfter from './InlineBeforeAfter';
import SoundDisclaimer from './SoundDisclaimer';

import {loremIpsum1, loremIpsum2, loremIpsum3} from './loremIpsum';

export default {
  heading: {
    name: 'Überschrift',
    component: Heading
  },
  textBlock: {
    name: 'Text Block',
    component: TextBlock,
  },
  soundDisclaimer: {
    name: 'Sound Disclaimer',
    component: SoundDisclaimer
  },
  loremIpsum1: {
    name: 'Blindtext 1',
    component: TextBlock,
    props: {
      children: loremIpsum1
    }
  },
  loremIpsum2: {
    name: 'Blindtext 2',
    component: TextBlock,
    props: {
      children: loremIpsum2
    }
  },
  loremIpsum3: {
    name: 'Blindtext 3',
    component: TextBlock,
    props: {
      children: loremIpsum3
    }
  },
  inlineImage: {
    name: 'Inline Bild',
    component: InlineImage,
    position: 'inline',
    inlinePositioning: true
  },
  inlineVideo: {
    name: 'Inline Video',
    component: InlineVideo,
    inlinePositioning: true
  },
  inlineBeforeAfter: {
    name: 'Inline Before/After',
    component: InlineBeforeAfter,
    inlinePositioning: true
  },
  stickyImage: {
    name: 'Sticky Bild',
    component: InlineImage,
    position: 'sticky',
    inlinePositioning: true
  }
}
