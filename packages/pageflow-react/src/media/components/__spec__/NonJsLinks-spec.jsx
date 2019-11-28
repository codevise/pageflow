import {NonJsLinks} from '../NonJsLinks';

import {mount} from 'enzyme';

describe('NonJsLinks', () => {
  it('renders link to audio file', () => {
    const file = {
      collectionName: 'audioFiles',
      id: 5
    };
    const wrapper = mount(<NonJsLinks entrySlug="my-entry"
                                      file={file}
                                      t={() => {}}/>);

    expect(wrapper.find('a')).toHaveProp('href', '/my-entry/audio/5');
  });

  it('renders link to video file', () => {
    const file = {
      collectionName: 'videoFiles',
      id: 6
    };
    const wrapper = mount(<NonJsLinks entrySlug="my-entry"
                                      file={file}
                                      t={() => {}}/>);

    expect(wrapper.find('a')).toHaveProp('href', '/my-entry/videos/6');
  });

  it('renders nothing when no file is given', () => {
    const wrapper = mount(<NonJsLinks entrySlug="my-entry"
                                      file={null}
                                      t={() => {}}/>);

    expect(wrapper).not.toContainMatchingElement('a');
  });
});
