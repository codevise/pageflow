import {MediaPlayerControls} from '../PlayerControls';
import PlayerControls from 'components/PlayerControls';

import {expect} from 'support/chai';
import {shallow} from 'enzyme';

describe('PlayerControls', () => {
  const requiredProps = {
    playerState: {},
    playerActions: {},
    t: () => {}
  };

  it('renders ok', () => {
    const result = shallow(<MediaPlayerControls {...requiredProps} />);

    expect(result).to.be.ok;
  });


  it('renders auto, off and id menu items when text tracks are passed', () => {
    const textTracks = {
      files: [
        {id: 5, displayLabel: 'English'}
      ]
    };

    const wrapper = shallow(<MediaPlayerControls {...requiredProps} textTracks={textTracks} />);
    const menuItemValues = wrapper
      .find(PlayerControls)
      .prop('textTracksMenuItems')
      .map(item => item.value);

    expect(menuItemValues).to.eql(['auto', 'off', 5]);
  });

  it('does not pass text track menu items when no text track files are passed', () => {
    const textTracks = {
      files: []
    };

    const wrapper = shallow(<MediaPlayerControls {...requiredProps} textTracks={textTracks} />);
    const menuItems = wrapper.find(PlayerControls).prop('textTracksMenuItems');

    expect(menuItems).to.eql([]);
  });
});
