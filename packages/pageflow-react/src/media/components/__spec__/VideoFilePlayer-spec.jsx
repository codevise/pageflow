import {VideoFilePlayerPreload} from '../VideoFilePlayer';

import {mount} from 'enzyme';
import sinon from 'sinon';
import {expect, stubFeatureDetection} from 'support';

describe('VideoFilePlayerPreload', () => {
  stubFeatureDetection();

  it('calls preloadImage with poster url on mount', () => {
    const preloadImage = sinon.spy();
    const videoFile = {urls: {'poster_large': 'poster.png'}};

    mount(<VideoFilePlayerPreload file={videoFile} preloadImage={preloadImage} />);

    expect(preloadImage).toHaveBeenCalledWith('poster.png');
  });

  it('prefers custom poster', () => {
    const preloadImage = sinon.spy();
    const videoFile = {urls: {'poster_large': 'poster.png'}};
    const posterImageFile = {urls: {'large': 'custom.png'}};

    mount(<VideoFilePlayerPreload file={videoFile}
                                  posterImageFile={posterImageFile}
                                  preloadImage={preloadImage} />);

    expect(preloadImage).toHaveBeenCalledWith('custom.png');
  });
});
