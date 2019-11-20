import {MediaPage as Page} from '../Page';
import MediaPlayerControls from '../PlayerControls';

import {shallow} from 'enzyme';

describe('Page', () => {
  it('renders ok', () => {
    const props = {
      page: {},
      playerState: {},
      textTracks: {}
    };

    const result = shallow(<Page {...props} />);

    expect(result).to.be.ok;
  });

  it('passes playerControlsComponent prop to MediaPlayerControls', () => {
    const playerControlsComponent = function() {};
    const props = {
      page: {},
      playerState: {},
      textTracks: {},
      playerControlsComponent
    };

    const wrapper = shallow(<Page {...props} />).find(MediaPlayerControls);

    expect(wrapper).to.be.have.prop('playerControlsComponent', playerControlsComponent);
  });
});
