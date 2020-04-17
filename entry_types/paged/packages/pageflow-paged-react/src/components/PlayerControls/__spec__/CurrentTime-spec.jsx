import CurrentTime from '../CurrentTime';
import TimeDisplay from '../TimeDisplay';

import {shallow} from 'enzyme';

describe('CurrentTime', () => {
  it('displays currentTime prop', () => {
    const result = shallow(<CurrentTime currentTime={10} />);

    expect(result.find(TimeDisplay)).toHaveProp('value', 10);
  });
});
