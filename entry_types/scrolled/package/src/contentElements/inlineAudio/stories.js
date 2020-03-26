import './frontend';
import {storiesOfContentElement, filePermaId} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'inlineAudio',
  baseConfiguration: {
    background_image_id: filePermaId('imageFiles', 'turtle'),
    background_type: "background_image",
    source: undefined
  },
  variants: [
    {
      name: 'Classic',
      configuration: {player_controls: "classic"}
    },
    {
      name: 'Slim',
      configuration: {player_controls: "slim"}
    },
    {
      name: 'Waveform',
      configuration: {player_controls: "waveform"}
    }
  ]
});
