import ProgressSlider from '../ProgressSlider';

import {mount} from 'enzyme';

describe('ProgressSlider', () => {
  it('sets width of load progress', () => {
    const result = mount(<ProgressSlider bufferedEnd={45} duration={100} />);

    expect(result.find('.vjs-load-progress')).to.have.style('width', '45%');
  });

  it('sets width of play progress based on current time and duration', () => {
    const result = mount(<ProgressSlider currentTime={25} duration={100} />);

    expect(result.find('.vjs-play-progress')).to.have.style('width', '25%');
  });

  it('sets width of play progress to 0 if duration is 0', () => {
    const result = mount(<ProgressSlider currentTime={25} duration={0} />);

    expect(result.find('.vjs-play-progress')).to.have.style('width', '0px');
  });

  it('sets width of play progress to 0 if current time is undefined', () => {
    const result = mount(<ProgressSlider currentTime={undefined} duration={100} />);

    expect(result.find('.vjs-play-progress')).to.have.style('width', '0px');
  });

  it('sets left of handle based on current time and duration', () => {
    const result = mount(<ProgressSlider currentTime={25} duration={100} />);

    expect(result.find('.vjs-seek-handle')).to.have.style('left', '25%');
  });

  it('sets left of handle to 0 if current time and is undefined', () => {
    const result = mount(<ProgressSlider currentTime={undefined} duration={100} />);

    expect(result.find('.vjs-seek-handle')).to.have.style('left', '0px');
  });
});
