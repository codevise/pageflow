import '../frontend';
import {storiesOfContentElement, filePermaId} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'inlineAudio',
  baseConfiguration: {
    id: filePermaId('audioFiles', 'quicktime_jingle'),
    autoplay: false,
    controls: false
  },
  variants: [
    {
      name: 'stand alone',
    },
    {
      name: 'stand alone with caption',
      configuration: {
        caption: 'Some caption'
      }
    },
    {
      name: 'with poster image',
      configuration: {
        posterId: filePermaId('imageFiles', 'turtle')
      }
    },
    {
      name: 'with poster image and caption',
      configuration: {
        posterId: filePermaId('imageFiles', 'turtle'),
        caption: 'Some caption'
      }
    },
    {
      name: 'with waveform',
      configuration: {
        playerControlVariant: 'waveform',
        waveformColor: '#1963ad'
      }
    },
    {
      name: 'with waveform and caption',
      configuration: {
        playerControlVariant: 'waveform',
        waveformColor: '#1963ad',
        caption: 'Some caption'
      }
    },
    {
      name: 'with waveform and poster image',
      configuration: {
        playerControlVariant: 'waveform',
        waveformColor: '#1963ad',
        posterId: filePermaId('imageFiles', 'turtle')
      }
    },
    {
      name: 'with waveform, poster image and caption',
      configuration: {
        playerControlVariant: 'waveform',
        waveformColor: '#1963ad',
        posterId: filePermaId('imageFiles', 'turtle'),
        caption: 'Some caption'
      }
    }
  ],
  inlineFileRights: true
});
